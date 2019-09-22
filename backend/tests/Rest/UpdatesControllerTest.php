<?php


namespace FL\Assistant\Tests\Rest;


class UpdatesControllerTest extends RestTestCase {

	public function test_can_list_updates() {
		wp_set_current_user( 1 );

		$namespace = '/fl-assistant/v1';
		$request   = new \WP_REST_Request( 'GET', $namespace . '/updates' );
		$response  = $this->server->dispatch( $request );

		$this->assertEquals( 200, $response->get_status() );
		$data = $response->get_data();

		$this->assertIsPager( $data );
	}

	public function test_can_get_updates_count() {
		wp_set_current_user( 1 );

		$namespace = '/fl-assistant/v1';
		$request   = new \WP_REST_Request( 'GET', $namespace . '/updates/count' );
		$response  = $this->server->dispatch( $request );

		$this->assertEquals( 200, $response->get_status() );

		$data = $response->get_data();

		$this->assertArrayHasKey( 'plugins', $data );
		$this->assertArrayHasKey( 'themes', $data );
		$this->assertArrayHasKey( 'total', $data );
	}
}
