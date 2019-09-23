<?php


namespace FL\Assistant\Tests\Rest;


class UsersControllerTest extends RestTestCase {

	public function test_can_get_users() {
		wp_set_current_user( 1 );

		$this->factory()->user->create_many( 10 );

		$namespace = '/fl-assistant/v1';
		$request   = new \WP_REST_Request( 'GET', $namespace . '/users' );
		$response  = $this->server->dispatch( $request );

		$this->assertEquals( 200, $response->get_status() );
		$data = $response->get_data();

		$this->assertIsPager( $data );
	}

	public function test_editor_cannot_list_users() {
		$user_id = $this->factory->user->create();
		wp_set_current_user( $user_id );

		$user = wp_get_current_user();
		$user->set_role( 'editor' );

		$namespace = '/fl-assistant/v1';
		$request   = new \WP_REST_Request( 'GET', $namespace . '/users' );
		$response  = $this->server->dispatch( $request );

		// 403 not authorized
		$this->assertEquals( 403, $response->get_status() );

	}

	public function test_can_get_users_count() {
		wp_set_current_user( 1 );
		$namespace = '/fl-assistant/v1';
		$request   = new \WP_REST_Request( 'GET', $namespace . '/users/count' );
		$response  = $this->server->dispatch( $request );
		$this->assertEquals( 200, $response->get_status() );
		$data = $response->get_data();

		$this->assertIsArray( $data );
		$this->assertArrayHasKey( 'total', $data );
		$this->assertArrayHasKey( 'administrator', $data );
	}
}
