<?php

namespace FL\Assistant\Controllers\Cloud\Libraries;

use FL\Assistant\System\Contracts\ControllerAbstract;

class LibraryItemImageController extends ControllerAbstract {

	public function register_routes() {
		$this->route(
			'/library-items/import/image', [
				[
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'import' ],
					'permission_callback' => function () {
						return current_user_can( 'edit_others_posts' );
					},
				],
			]
		);
	}

	/**
	 * Import an image library item into the site.
	 */
	public function import( $request ) {
		require_once( ABSPATH . 'wp-admin/includes/image.php' );
		require_once( ABSPATH . 'wp-admin/includes/file.php' );
		require_once( ABSPATH . 'wp-admin/includes/media.php' );

		$item = $request->get_param( 'item' );

		if ( ! is_array( $item ) || ! isset( $item['media']['file'] ) ) {
			return rest_ensure_response( [ 'error' => __( 'Missing item data.' ) ] );
		}

		$url = $item['media']['file']['url'];
		$url_filename = basename( parse_url( $url, PHP_URL_PATH ) );
		$tmp_file = wp_tempnam( $url_filename );

		if ( ! $tmp_file ) {
			return rest_ensure_response( [ 'error' => __( 'Error creating temp file.' ) ] );
		}

		$response = wp_remote_get(
			$url,
			[
				'timeout'   => 300,
				'stream'    => true,
				'filename'  => $tmp_file,
				'sslverify' => false,
			]
		);

		$response_code = wp_remote_retrieve_response_code( $response );

		if ( 200 != $response_code ) {
			@unlink( $tmp_file );
			return rest_ensure_response( [ 'error' => __( 'Error downloading image file.' ) ] );
		}

		$id = media_handle_sideload(
			[
				'name' => sanitize_file_name( $item['name'] ),
				'tmp_name' => $tmp_file
			]
		);

		if ( is_wp_error( $id ) ) {
			@unlink( $tmp_file );
			return rest_ensure_response( [ 'error' => __( 'Error importing image file.' ) ] );
		}

		return rest_ensure_response( [
			'id' => $id,
			'url' => wp_get_attachment_url( $id ),
		] );
	}
}
