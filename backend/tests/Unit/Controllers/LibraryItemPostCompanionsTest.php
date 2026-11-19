<?php
namespace FL\Assistant\Tests\Unit\Controllers;

use FL\Assistant\Tests\Unit\BaseTestCase;
use FL\Assistant\Controllers\Cloud\Libraries\LibraryItemPostController;
use FL\Assistant\Helpers\CompanionPostsHelper;

/**
 * Builds the controller without the DI container and exposes the import
 * steps; none of them touch the injected transformer or the cloud client.
 */
class CompanionsLibraryItemPostController extends LibraryItemPostController {

	public function __construct() {} // phpcs:ignore

	public function run_import_item( $item ) {
		return $this->import_item( $item );
	}

	public function run_import_companions( $item ) {
		return $this->import_companions( $item );
	}
}

class LibraryItemPostCompanionsTest extends BaseTestCase {

	const KEY = CompanionPostsHelper::META_KEY;

	private function controller() {
		return new CompanionsLibraryItemPostController();
	}

	private function save_data( $post_id ) {
		$request = new \WP_REST_Request( 'POST', '/fl-assistant/v1/posts/' . $post_id . '/library/1' );

		return $this->controller()->get_save_data( $request, get_post( $post_id ) );
	}

	private function declare_companions( array $companions ) {
		add_filter(
			'fl_assistant_library_companion_posts',
			function () use ( $companions ) {
				return $companions;
			}
		);
	}

	/**
	 * A fetched library item whose meta embeds the given companion entries.
	 */
	private function item_with_companions( array $entries ) {
		return json_decode(
			wp_json_encode(
				[
					'data' => [
						'meta' => [ self::KEY => [ CompanionPostsHelper::encode( $entries ) ] ],
					],
				]
			)
		);
	}

	private function companion_entry( $title, $content = '', $post_type = 'post' ) {
		return [
			'post'  => [
				'comment_status' => 'closed',
				'menu_order'     => 0,
				'ping_status'    => 'closed',
				'post_content'   => $content,
				'post_excerpt'   => '',
				'post_mime_type' => '',
				'post_name'      => sanitize_title( $title ),
				'post_title'     => $title,
				'post_type'      => $post_type,
			],
			'meta'  => [ '_companion_uuid' => [ 'abc-123' ] ],
			'terms' => [],
		];
	}

	private function find_by_title( $title ) {
		return get_posts(
			[
				'post_type'   => 'any',
				'post_status' => 'any',
				'title'       => $title,
			]
		);
	}

	public function test_save_data_embeds_each_declared_companion_once() {
		$page_id      = self::factory()->post->create( [ 'post_type' => 'page' ] );
		$companion_id = self::factory()->post->create( [ 'post_title' => 'Brand system' ] );
		update_post_meta( $companion_id, '_companion_uuid', 'abc-123' );
		$this->declare_companions( [ get_post( $companion_id ), get_post( $companion_id ), 'not a post' ] );

		$meta    = $this->save_data( $page_id )['post_data']['meta'];
		$entries = json_decode( $meta[ self::KEY ][0], true );

		$this->assertCount( 1, $entries );
		$this->assertSame( 'Brand system', $entries[0]['post']['post_title'] );
		$this->assertSame( [ 'abc-123' ], $entries[0]['meta']['_companion_uuid'] );
		$this->assertArrayHasKey( 'terms', $entries[0] );
	}

	public function test_save_data_has_no_companion_key_without_companions() {
		$page_id = self::factory()->post->create( [ 'post_type' => 'page' ] );

		$this->assertArrayNotHasKey( self::KEY, $this->save_data( $page_id )['post_data']['meta'] );
	}

	public function test_save_data_does_not_upload_a_stale_local_companion_value() {
		$page_id = self::factory()->post->create( [ 'post_type' => 'page' ] );
		update_post_meta( $page_id, self::KEY, 'stale' );

		$this->assertArrayNotHasKey( self::KEY, $this->save_data( $page_id )['post_data']['meta'] );
	}

	public function test_import_creates_a_companion_with_its_content_and_meta_intact() {
		$content = wp_json_encode( [ 'base' => ".badge {\n  content: \"x\";\n}" ] );
		$item    = $this->item_with_companions( [ $this->companion_entry( 'Imported system', $content ) ] );

		$errors = $this->controller()->run_import_companions( $item );
		$posts  = $this->find_by_title( 'Imported system' );

		$this->assertSame( [], $errors );
		$this->assertCount( 1, $posts );
		$this->assertSame( $content, $posts[0]->post_content );
		$this->assertSame( 'abc-123', get_post_meta( $posts[0]->ID, '_companion_uuid', true ) );
	}

	public function test_import_skips_a_companion_a_plugin_reports_as_present() {
		$item = $this->item_with_companions( [ $this->companion_entry( 'Already here' ) ] );
		add_filter(
			'fl_assistant_library_companion_exists',
			function ( $exists, $companion ) {
				return 'Already here' === $companion->data->post->post_title;
			},
			10,
			2
		);

		$this->assertSame( [], $this->controller()->run_import_companions( $item ) );
		$this->assertCount( 0, $this->find_by_title( 'Already here' ) );
	}

	public function test_import_returns_an_error_for_a_companion_it_cannot_create() {
		$item = $this->item_with_companions(
			[
				$this->companion_entry( 'Unknown type', '', 'not_registered_here' ),
				$this->companion_entry( 'Still imported' ),
			]
		);

		$errors = $this->controller()->run_import_companions( $item );

		$this->assertCount( 1, $errors );
		$this->assertSame( 'post_type_not_registered', $errors[0]->get_error_code() );
		$this->assertSame( 'Unknown type', $errors[0]->get_error_data()['name'] );
		$this->assertCount( 1, $this->find_by_title( 'Still imported' ) );
	}

	public function test_import_ignores_a_malformed_companion_value() {
		$item = json_decode( wp_json_encode( [ 'data' => [ 'meta' => [ self::KEY => [ 'not json' ] ] ] ] ) );

		$this->assertSame( [], $this->controller()->run_import_companions( $item ) );
	}

	public function test_imported_meta_keeps_its_bytes_and_never_stores_the_companion_key() {
		$post_id = self::factory()->post->create();
		$value   = 'a\\"b \\n c\'d';
		$meta    = (object) [
			self::KEY    => [ 'embedded' ],
			'_test_meta' => [ $value ],
		];

		$this->controller()->import_post_meta_from_library( $post_id, $meta );

		$this->assertSame( $value, get_post_meta( $post_id, '_test_meta', true ) );
		$this->assertFalse( metadata_exists( 'post', $post_id, self::KEY ) );
	}

	public function test_media_url_rewrite_keeps_escapes_inside_nested_json() {
		$post_id    = self::factory()->post->create();
		$block_data = '{"html":"<p class=\"lead\">Hi<\/p>"}';
		$node       = (object) [ 'settings' => (object) [ 'ds_block_data' => $block_data ] ];
		$meta       = (object) [
			'_fl_builder_data'          => [ serialize( [ 'node1' => $node ] ) ], // phpcs:ignore
			'_fl_builder_data_settings' => [ '' ],
		];

		$this->controller()->import_post_meta_from_library( $post_id, $meta );
		$this->controller()->replace_imported_attachment_urls_in_meta( $post_id, [] );

		$stored = get_post_meta( $post_id, '_fl_builder_data', true );

		$this->assertSame( $block_data, $stored['node1']->settings->ds_block_data );
	}
}
