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
		if ( ! isset(  $_GET['fl_asst_image_proxy'] ) && ! isset( $_GET['url'] ) ) {
			return;
		}

		$url = esc_url_raw( $_GET['url'] );
		$url = urldecode( $url );

		if ( 0 !== strpos( $url, 'http' ) ) {
			return;
		}

		$response = wp_safe_remote_get( $url );

		if ( is_wp_error( $response ) ) {
			return;
		}

		$body = wp_remote_retrieve_body( $response );
		$headers = wp_remote_retrieve_headers( $response );

		// validate image
		$filesystem = self::filesystem();
		$tmpfile    = tempnam( '/tmp', 'assistant' );
		$filesystem->put_contents( $tmpfile, $body );
		$validimage = wp_get_image_mime( $tmpfile );
		$filesystem->delete( $tmpfile );

		if ( ! $validimage ) {
			return false;
		}

		if ( ! isset( $headers['content-type'] ) ) {
			return;
		} elseif ( 0 !== strpos( $headers['content-type'], 'image/' ) ) {
			return;
		}

		header( 'Content-type: ' . $headers['content-type'] );
		echo $body;
		die();
	}

	private function filesystem() {
		global $wp_filesystem;

		if ( is_null( $wp_filesystem ) ) {
			require_once ABSPATH . '/wp-admin/includes/file.php';
			WP_Filesystem();
		}

		return $wp_filesystem;
	}
}
