<?php

namespace FL\Assistant\Tests\Unit\Controllers;

use FL\Assistant\Tests\Unit\ControllerTestCase;

class CommentsControllerTest extends ControllerTestCase {
	public function test_can_get_comments() {
		wp_set_current_user( 1 );
		$request  = new \WP_REST_Request( 'GET', '/fl-assistant/v1/comments' );
		$response = $this->server->dispatch( $request );

		$this->assertEquals( 200, $response->get_status() );
		$data = $response->get_data();

		$this->assertIsPager( $data );
	}
}
