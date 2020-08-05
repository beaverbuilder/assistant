<?php

namespace FL\Assistant\Hooks;

class CloudPostPreview {

	public function __construct() {
		if ( isset( $_GET['fl_asst_library_item_preview'] ) ) {
			add_action( 'parse_query', [ $this, 'parse_query' ], PHP_INT_MAX );
		}
	}

	public function parse_query( $query ) {
		if ( $query->is_main_query() ) {
			if ( current_user_can( 'edit_others_posts' ) ) {
				add_filter( 'posts_results', [ $this, 'override_posts_results' ], PHP_INT_MAX );
				wp_set_current_user( 0 );
			}
		}
	}

	public function override_posts_results( $posts ) {
		remove_filter( 'posts_results', [ $this, 'override_posts_results' ], PHP_INT_MAX );

		$post_id = absint( $_GET['page_id'] );
		$preview = get_post( $post_id );
		$preview->post_status = 'publish';

		return [ $preview ];
	}
}
