<?php
namespace FL\Assistant\Tests\Unit\Controllers;

use FL\Assistant\Tests\Unit\BaseTestCase;
use FL\Assistant\Controllers\Cloud\Libraries\LibraryItemPostController;

/**
 * Builds the controller without the DI container; get_save_data() never
 * touches the injected transformer.
 */
class SaveDataLibraryItemPostController extends LibraryItemPostController {

	public function __construct() {} // phpcs:ignore
}

class LibraryItemPostSaveDataTest extends BaseTestCase {

	private function save_data( $screenshot ) {
		$post_id = self::factory()->post->create( [ 'post_title' => 'Screenshot test' ] );
		$request = new \WP_REST_Request( 'POST', '/fl-assistant/v1/posts/' . $post_id . '/sync_to_library/1' );

		if ( null !== $screenshot ) {
			$request->set_param( 'screenshot', $screenshot );
		}

		return ( new SaveDataLibraryItemPostController() )->get_save_data( $request, get_post( $post_id ) );
	}

	public function test_save_data_sends_client_screenshot_as_base64() {
		$data = $this->save_data( 'data:image/png;base64,AAAA' );

		$this->assertSame( 'base64', $data['screenshot']['type'] );
		$this->assertSame( 'data:image/png;base64,AAAA', $data['screenshot']['data'] );
	}

	public function test_save_data_omits_screenshot_when_client_sent_none() {
		$this->assertArrayNotHasKey( 'screenshot', $this->save_data( null ) );
	}

	public function test_save_data_omits_screenshot_when_client_sent_empty() {
		$this->assertArrayNotHasKey( 'screenshot', $this->save_data( '' ) );
	}
}
