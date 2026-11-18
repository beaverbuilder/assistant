<?php


namespace FL\Assistant\Tests\Unit\Data\Repository;

use FL\Assistant\Data\Repository\CodeRepository;
use FL\Assistant\Tests\Unit\BaseTestCase;

class CodeRepositoryTest extends BaseTestCase {

	/**
	 * A published, enabled, site-wide snippet renders when its author holds unfiltered_html.
	 */
	public function test_renders_snippet_from_capable_author() {
		$code = 'window.rendered = 1;';
		$this->make_snippet( 1, 'publish', $code );

		$result = ( new CodeRepository() )->evalute_code_rules( $this->entire_site_view() );

		$this->assertContains( $code, $result['JavaScript'] ?? [] );
	}

	/**
	 * A snippet whose author lacks unfiltered_html must not render, even if published and enabled.
	 */
	public function test_skips_snippet_from_author_without_cap() {
		$author = self::factory()->user->create( [ 'role' => 'editor' ] );
		get_user_by( 'id', $author )->add_cap( 'unfiltered_html', false );
		$code = 'window.shouldNotRender = 1;';
		$this->make_snippet( $author, 'publish', $code );

		$result = ( new CodeRepository() )->evalute_code_rules( $this->entire_site_view() );

		$this->assertNotContains( $code, $result['JavaScript'] ?? [] );
	}

	/**
	 * A draft snippet must not render (guards the published -> publish status fix).
	 */
	public function test_skips_draft_snippet() {
		$code = 'window.draft = 1;';
		$this->make_snippet( 1, 'draft', $code );

		$result = ( new CodeRepository() )->evalute_code_rules( $this->entire_site_view() );

		$this->assertNotContains( $code, $result['JavaScript'] ?? [] );
	}

	/**
	 * Creates an enabled, site-wide JavaScript snippet owned by the given author.
	 *
	 * @param int    $author
	 * @param string $status
	 * @param string $code
	 * @return int
	 */
	private function make_snippet( $author, $status, $code ) {
		$id = self::factory()->post->create(
			[
				'post_type'   => 'fl_code',
				'post_status' => $status,
				'post_author' => $author,
			]
		);
		update_post_meta( $id, '_fl_asst_enable', '1' );
		update_post_meta( $id, '_fl_asst_code_type', 'JavaScript' );
		update_post_meta( $id, '_fl_asst_code', $code );
		update_post_meta( $id, '_fl_asst_code_locations', [ [ 'type' => 'entire_site' ] ] );

		return $id;
	}

	/**
	 * A minimal view that matches an entire_site location rule.
	 *
	 * @return array
	 */
	private function entire_site_view() {
		return [ 'type_name' => 'post' ];
	}
}
