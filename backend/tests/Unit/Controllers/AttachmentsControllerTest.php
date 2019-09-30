<?php
namespace FL\Assistant\Tests\Unit\Controllers;

use FL\Assistant\Tests\Unit\ControllerTestCase;

class AttachmentsControllerTest extends ControllerTestCase {

	public function test_can_get_attachments() {
		wp_set_current_user( 1 );
		$request  = new \WP_REST_Request( 'GET', '/fl-assistant/v1/attachments' );
		$response = $this->server->dispatch( $request );

		$this->assertEquals( 200, $response->get_status() );
		$data = $response->get_data();

		$this->assertIsPager( $data );
	}

	public function test_can_get_counts() {
		wp_set_current_user( 1 );

		$request  = new \WP_REST_Request( 'GET', '/fl-assistant/v1/attachments/count' );
		$response = $this->server->dispatch( $request );
		$this->assertEquals( 200, $response->get_status() );
		$data = $response->get_data();

		$this->assertIsArray( $data );
		$this->assertArrayHasKey( 'trash', $data );
	}

	public function test_can_get_single_attachment() {
		wp_set_current_user( 1 );

		$attachment_id = $this->factory()
			->attachment
			->create_upload_object( __DIR__ . '/../../resources/mountains.jpg' );

		$route    = sprintf( '/fl-assistant/v1/attachments/%d', $attachment_id );
		$request  = new \WP_REST_Request( 'GET', $route );
		$response = $this->server->dispatch( $request );
		$this->assertEquals( 200, $response->get_status() );
		$data = $response->get_data();
		$this->assertIsArray( $data );
		$this->assertArrayHasKey( 'id', $data );
		$this->assertArrayHasKey( 'title', $data );
		$this->assertArrayHasKey( 'thumbnail', $data );
	}

	public function test_can_trash_attachment() {
		wp_set_current_user( 1 );

		$attachment_id = $this->factory()
			->attachment
			->create_upload_object( __DIR__ . '/../../resources/mountains.jpg' );

		$route = sprintf( '/fl-assistant/v1/attachments/%d', $attachment_id );

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
	}
}
