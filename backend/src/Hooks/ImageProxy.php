<?php

namespace FL\Assistant\Hooks;

class ImageProxy {

	public function __construct() {
		add_action(
			'init', function() {
				if ( ! current_user_can( 'edit_others_posts' ) ) {
					return;
				}
				if ( isset( $_GET['fl_asst_image_proxy'] ) ) {
					self::render_image();
				}
			}
		);
	}

	public function render_image() {
		$url = urldecode( $_GET['fl_asst_image_proxy'] );
		$url = str_replace( '?url=', '', $url );

		if ( 0 !== strpos( $url, 'http' ) ) {
			return;
		}

		$response = wp_remote_get( $url );

		if ( is_wp_error( $response ) ) {
			return;
		}

		$body = wp_remote_retrieve_body( $response );
		$headers = wp_remote_retrieve_headers( $response );

		if ( ! isset( $headers['content-type'] ) ) {
			return;
		} elseif ( 0 !== strpos( $headers['content-type'], 'image/' ) ) {
			return;
		}

		header( 'Content-type: ' . $headers['content-type'] );
		echo $body;
		die();
	}
}
