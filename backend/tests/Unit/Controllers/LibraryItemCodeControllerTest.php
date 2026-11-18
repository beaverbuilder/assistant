<?php

namespace FL\Assistant\Tests\Unit\Controllers;

use FL\Assistant\Tests\Unit\BaseTestCase;
use FL\Assistant\Controllers\Cloud\Libraries\LibraryItemCodeController;

/**
 * Bypasses the DI constructor; the capability gate under test runs before any
 * injected dependency is touched.
 */
class TestableLibraryItemCodeController extends LibraryItemCodeController {

	public function __construct() {} // phpcs:ignore
}

class LibraryItemCodeControllerTest extends BaseTestCase {

	/**
	 * Importing a code item must be refused when the user lacks unfiltered_html.
	 */
	public function test_import_requires_unfiltered_html() {
		$user_id = self::factory()->user->create( [ 'role' => 'editor' ] );
		get_user_by( 'id', $user_id )->add_cap( 'unfiltered_html', false );
		wp_set_current_user( $user_id );

		$request = new \WP_REST_Request( 'POST', '/fl-assistant/v1/library-items/import/code' );
		$request->set_body_params(
			[
				'item' => [
					'name'        => 'poc',
					'description' => '',
					'data'        => [ 'extension' => 'js', 'content' => 'alert(1)' ],
				],
			]
		);

		$data = ( new TestableLibraryItemCodeController() )->import( $request )->get_data();

		$this->assertArrayHasKey( 'error', $data );
		$this->assertTrue( $data['error'] );
		$this->assertEmpty( get_posts( [ 'post_type' => 'fl_code', 'post_status' => 'any' ] ) );
	}
}
