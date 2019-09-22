<?php


namespace FL\Assistant\Tests\Rest;


class AttachmentsControllerTest extends RestTestCase {

	public function test_can_get_attachments() {
		wp_set_current_user( 1 );
		$request = new \WP_REST_Request( 'GET', '/fl-assistant/v1/attachments' );
		$response = $this->server->dispatch( $request );

		$this->assertEquals( 200, $response->get_status() );
		$data = $response->get_data();

		$this->assertIsPager( $data );
	}

	public function test_can_get_counts() {
		wp_set_current_user( 1 );

		$request = new \WP_REST_Request( 'GET', '/fl-assistant/v1/attachments/count' );
		$response = $this->server->dispatch( $request );
		$this->assertEquals( 200, $response->get_status() );
		$data = $response->get_data();

		print_r( $data );
	}

	public function test_can_get_single_attachment() {
		wp_set_current_user( 1 );

		// @todo generate single attachment and replace this var with its id
		$attachment_id = 1;

		$route = sprintf( '/fl-assistant/v1/attachment/%d', $attachment_id );
		$request = new \WP_REST_Request( 'GET', $route );
		$response = $this->server->dispatch( $request );
		$this->assertEquals( 200, $response->get_status() );
		$data = $response->get_data();

		print_r( $data );
	}

	public function test_can_update_attachment() {
		wp_set_current_user( 1 );

		// @todo generate single attachment and replace this var with its id
		$attachment_id = 1;

		$route = sprintf( '/fl-assistant/v1/attachment/%d', $attachment_id );

		$request = new \WP_REST_Request( 'GET', $route );
		$request->set_body_params(
			[
				'id'     => $attachment_id,
				'action' => 'trash',
			]
		);

		$response = $this->server->dispatch( $request );
		$this->assertEquals( 200, $response->get_status() );
		$data = $response->get_data();

		print_r( $data );
	}
}
