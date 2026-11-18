<?php


namespace FL\Assistant\Tests\Unit\Controllers;

use FL\Assistant\Tests\Unit\ControllerTestCase;

class PostsControllerTest extends ControllerTestCase {
	public function test_can_get_posts() {
		wp_set_current_user( 1 );
		$request = new \WP_REST_Request( 'GET', '/fl-assistant/v1/posts' );
		$response = $this->server->dispatch( $request );

		$this->assertEquals( 200, $response->get_status() );
		$data = $response->get_data();

		$this->assertIsPager( $data );
	}

	/**
	 * An Editor without unfiltered_html must not be able to create a code snippet.
	 */
	public function test_editor_without_unfiltered_html_cannot_create_code() {
		$this->login_as_editor_without_unfiltered_html();

		$request = new \WP_REST_Request( 'POST', '/fl-assistant/v1/posts' );
		$request->set_body_params(
			[
				'post_type'   => 'fl_code',
				'post_status' => 'publish',
				'post_title'  => 'poc',
				'meta_input'  => [
					'_fl_asst_code_type' => 'JavaScript',
					'_fl_asst_code'      => 'alert(1)',
					'_fl_asst_enable'    => '1',
				],
			]
		);

		$data = $this->server->dispatch( $request )->get_data();

		$this->assertArrayHasKey( 'error', $data );
		$this->assertTrue( $data['error'] );
		$this->assertEmpty( get_posts( [ 'post_type' => 'fl_code', 'post_status' => 'any' ] ) );
	}

	/**
	 * An Editor without unfiltered_html must not be able to enable a snippet through the meta update path.
	 */
	public function test_editor_without_unfiltered_html_cannot_enable_code() {
		$code_id = self::factory()->post->create( [ 'post_type' => 'fl_code' ] );
		$this->login_as_editor_without_unfiltered_html();

		$request = new \WP_REST_Request( 'POST', '/fl-assistant/v1/posts/' . $code_id );
		$request->set_body_params(
			[
				'id'     => $code_id,
				'action' => 'meta',
				'data'   => [ '_fl_asst_enable' => '1' ],
			]
		);

		$data = $this->server->dispatch( $request )->get_data();

		$this->assertArrayHasKey( 'error', $data );
		$this->assertSame( '', get_post_meta( $code_id, '_fl_asst_enable', true ) );
	}

	/**
	 * An Administrator keeps unfiltered_html, so creating a snippet still works.
	 */
	public function test_admin_can_create_code() {
		wp_set_current_user( 1 );

		$request = new \WP_REST_Request( 'POST', '/fl-assistant/v1/posts' );
		$request->set_body_params(
			[
				'post_type'   => 'fl_code',
				'post_status' => 'publish',
				'post_title'  => 'ok',
				'meta_input'  => [ '_fl_asst_code_type' => 'JavaScript' ],
			]
		);

		$data = $this->server->dispatch( $request )->get_data();

		$this->assertArrayNotHasKey( 'error', $data );
		$this->assertArrayHasKey( 'id', $data );
		$this->assertSame( 'JavaScript', get_post_meta( $data['id'], '_fl_asst_code_type', true ) );
	}

	/**
	 * A serialized string in meta_input must be dropped so it cannot be unserialized into an object on read.
	 */
	public function test_create_post_drops_serialized_meta() {
		wp_set_current_user( 1 );

		$payload = serialize( (object) [ 'x' => 1 ] );
		$request = new \WP_REST_Request( 'POST', '/fl-assistant/v1/posts' );
		$request->set_body_params(
			[
				'post_type'  => 'post',
				'post_title' => 'inj',
				'meta_input' => [ 'evil' => $payload ],
			]
		);

		$data = $this->server->dispatch( $request )->get_data();

		$this->assertArrayHasKey( 'id', $data );
		$this->assertSame( '', get_post_meta( $data['id'], 'evil', true ) );
	}

	/**
	 * Snippet bodies containing backslashes must round-trip through create unchanged.
	 */
	public function test_create_post_preserves_backslashes() {
		wp_set_current_user( 1 );

		$code = 'const re = /\\d+\\.\\d+/;';
		$request = new \WP_REST_Request( 'POST', '/fl-assistant/v1/posts' );
		$request->set_body_params(
			[
				'post_type'  => 'fl_code',
				'post_title' => 'slashes',
				'meta_input' => [ '_fl_asst_code' => $code ],
			]
		);

		$data = $this->server->dispatch( $request )->get_data();

		$this->assertSame( $code, get_post_meta( $data['id'], '_fl_asst_code', true ) );
	}

	/**
	 * create_post must reject a post type whose create capability the user lacks.
	 */
	public function test_create_post_rejects_type_without_capability() {
		register_post_type(
			'fl_locked',
			[
				'public'       => false,
				'map_meta_cap' => true,
				'capabilities' => [ 'create_posts' => 'manage_options' ],
			]
		);
		$this->login_as_editor_without_unfiltered_html();

		$request = new \WP_REST_Request( 'POST', '/fl-assistant/v1/posts' );
		$request->set_body_params(
			[
				'post_type'  => 'fl_locked',
				'post_title' => 'nope',
			]
		);

		$data = $this->server->dispatch( $request )->get_data();

		$this->assertArrayHasKey( 'error', $data );
		$this->assertEmpty( get_posts( [ 'post_type' => 'fl_locked', 'post_status' => 'any' ] ) );
	}

	/**
	 * Logs in as an Editor with unfiltered_html explicitly denied (as DISALLOW_UNFILTERED_HTML / multisite would).
	 *
	 * @return int
	 */
	private function login_as_editor_without_unfiltered_html() {
		$user_id = self::factory()->user->create( [ 'role' => 'editor' ] );
		$user = get_user_by( 'id', $user_id );
		$user->add_cap( 'unfiltered_html', false );
		wp_set_current_user( $user_id );

		return $user_id;
	}
}
