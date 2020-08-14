<?php

namespace FL\Assistant\Hooks;

class PostScreenshotPreview {

	public function __construct() {
		if ( isset( $_GET['fl_asst_screenshot_preview'] ) ) {
			add_action( 'parse_query', [ $this, 'parse_query' ], PHP_INT_MAX );
		}
	}

	public function parse_query( $query ) {
		wp_set_current_user( 0 );
	}
}
