<?php

namespace FL\Assistant\Hooks;

class PostPreview {

	protected $post_id;

	public function __construct() {
		if ( isset( $_GET['fl_asst_post_preview'] ) ) {
			if ( isset( $_GET['p'] ) ) {
				$this->post_id = absint( $_GET['p'] );
			} elseif ( isset( $_GET['page_id'] ) ) {
				$this->post_id = absint( $_GET['page_id'] );
			}

			if ( $this->post_id ) {
				add_action( 'parse_query', [ $this, 'parse_query' ], PHP_INT_MAX );
				add_filter( 'redirect_canonical', '__return_false', PHP_INT_MAX );
			}
		}

		if ( isset( $_GET['fl_asst_screenshot'] ) ) {
			add_filter( 'body_class', [ $this, 'body_class' ] );
			show_admin_bar( false );

			if ( $this->post_id ) {
				add_action( 'wp', [ $this, 'disable_known_theme_parts' ], PHP_INT_MAX );
			}
		}
	}

	public function parse_query( $query ) {
		if ( $query->is_main_query() ) {
			if ( current_user_can( 'edit_others_posts' ) ) {
				add_filter( 'posts_results', [ $this, 'override_posts_results' ], PHP_INT_MAX );
			}
		}
	}

	public function override_posts_results( $posts ) {
		remove_filter( 'posts_results', [ $this, 'override_posts_results' ], PHP_INT_MAX );

		$preview = get_post( $this->post_id );
		$preview->post_status = 'publish';

		return [ $preview ];
	}

	public function disable_known_theme_parts() {
		$this->disable_bb_theme();
		$this->disable_generate_press();
		$this->disable_genesis();
	}

	public function body_class( $classes ) {
		$classes[] = 'fl-asst-screenshot';
		return $classes;
	}

	protected function disable_bb_theme() {
		add_filter( 'fl_topbar_enabled', '__return_false' );
		add_filter( 'fl_fixed_header_enabled', '__return_false' );
		add_filter( 'fl_header_enabled', '__return_false' );
		add_filter( 'fl_footer_enabled', '__return_false' );
	}

	protected function disable_generate_press() {
		remove_action( 'generate_header', 'generate_construct_header' );
		remove_action( 'generate_after_header', 'generate_add_navigation_after_header', 5 );
		remove_action( 'generate_footer', 'generate_construct_footer_widgets', 5 );
		remove_action( 'generate_footer', 'generate_construct_footer' );
	}

	protected function disable_genesis() {
		remove_action( 'genesis_header', 'genesis_header_markup_open', 5 );
		remove_action( 'genesis_header', 'genesis_do_header' );
		remove_action( 'genesis_header', 'genesis_header_markup_close', 15 );
		remove_action( 'genesis_footer', 'genesis_footer_markup_open', 5 );
		remove_action( 'genesis_footer', 'genesis_do_footer' );
		remove_action( 'genesis_footer', 'genesis_footer_markup_close', 15 );
	}
}
