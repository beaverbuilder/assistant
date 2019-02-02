<?php

/**
 * Custom upgrader skin for handling updates via the rest api.
 */
class FL_Assistant_Upgrader extends WP_Upgrader_Skin {
	public function header() {}
	public function footer() {}
	public function bulk_header() {}
	public function bulk_footer() {}
	public function show_message() {}

	public function feedback( $string ) {
		if ( 'process_success' === $string ) {
			wp_send_json( array( 'success' => true ) );
		}
	}

	public function error( $error ) {
		if ( $error ) {
			wp_send_json( array( 'error' => true ) );
		}
	}
}
