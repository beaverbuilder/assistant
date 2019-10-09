<?php


namespace FL\Assistant\Tests\Unit\Controllers;

use FL\Assistant\Tests\Unit\ControllerTestCase;

class CountsControllerTest extends ControllerTestCase {
	public function test_can_get_counts() {
		wp_set_current_user( 1 );
		$request = new \WP_REST_Request( 'GET', '/fl-assistant/v1/counts' );
		$response = $this->server->dispatch( $request );

		$this->assertEquals( 200, $response->get_status() );
		$data = $response->get_data();

		$this->assertIsArray( $data );
		$this->assertArrayHasKey( 'content/post', $data );
		$this->assertArrayHasKey( 'content/page', $data );
		$this->assertArrayHasKey( 'taxonomy/category', $data );

		// @todo - assert the rest of the key
	}
}
