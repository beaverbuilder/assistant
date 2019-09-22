<?php


namespace FL\Assistant\Tests\Rest;


class CountsControllerTest extends RestTestCase {
	public function test_can_get_counts() {
		wp_set_current_user( 1 );
		$request = new \WP_REST_Request( 'GET', '/fl-assistant/v1/counts' );
		$response = $this->server->dispatch( $request );

		$this->assertEquals( 200, $response->get_status() );
		$data = $response->get_data();

		print_r( $data );
	}
}
