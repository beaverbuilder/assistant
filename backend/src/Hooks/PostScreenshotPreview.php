<?php

namespace FL\Assistant\Hooks;

class PostScreenshotPreview {

	public function __construct() {
		if ( isset( $_GET['fl_asst_screenshot_preview'] ) ) {
			add_action( 'parse_query', [ $this, 'parse_query' ], PHP_INT_MAX );
			add_action( 'wp', [ $this, 'disable_known_theme_parts' ], PHP_INT_MAX );
			add_filter( 'body_class', [ $this, 'body_class' ] );
		}
	}

	public function parse_query( $query ) {
		wp_set_current_user( 0 );
	}

	public function disable_known_theme_parts() {
		self::disable_bb_theme();
		self::disable_generate_press();
		self::disable_genesis();
	}

	public function body_class( $classes ) {
		$classes[] = 'fl-asst-sceenshot-preview';
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
