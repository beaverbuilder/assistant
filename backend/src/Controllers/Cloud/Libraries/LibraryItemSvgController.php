<?php

namespace FL\Assistant\Controllers\Cloud\Libraries;

use FL\Assistant\System\Contracts\ControllerAbstract;

class LibraryItemSvgController extends ControllerAbstract {

	public function register_routes() {
		$this->route(
			'/library-items/import/svg', [
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
	 * Import an svg library item into the site.
	 */
	public function import( $request ) {
		require_once( ABSPATH . 'wp-admin/includes/image.php' );
		require_once( ABSPATH . 'wp-admin/includes/file.php' );
		require_once( ABSPATH . 'wp-admin/includes/media.php' );

		$item = $request->get_param( 'item' );

		if ( ! is_array( $item ) || ! isset( $item['data']['xml'] ) ) {
			return rest_ensure_response( [ 'error' => __( 'Missing item data.' ) ] );
		}

		$tmp_path = trailingslashit( WP_CONTENT_DIR ) . 'fl-asst-' . uniqid() . '.svg';
		$result = file_put_contents( $tmp_path, $item['data']['xml'] );

		if ( false === $result ) {
			return rest_ensure_response( [ 'error' => __( 'Error writing SVG file.' ) ] );
		}

		$file_data = [
			'name' => sanitize_file_name( $item['name'] ),
			'tmp_name' => $tmp_path
		];

		$this->add_import_filters();
		$id = media_handle_sideload( $file_data, '0' );

		if ( is_wp_error( $id ) ) {
			@unlink( $file_data['tmp_name'] );
			return rest_ensure_response( [ 'error' => __( 'Error importing SVG file.' ) ] );
		}

		return rest_ensure_response( [
			'id' => $id,
			'url' => wp_get_attachment_url( $id ),
		] );
	}

	/**
	 * WP core media filters for allowing svg upload.
	 */
	private function add_import_filters() {
		add_filter( 'upload_mimes', function( $mimes ) {
			$mimes['svg'] = 'image/svg+xml';
			$mimes['svgz'] = 'image/svg+xml';
			return $mimes;
		}, 99 );

		add_filter( 'wp_check_filetype_and_ext', function ( $checked, $file, $filename, $mimes ) {
			if ( ! $checked['type'] ) {
				$check_filetype		= wp_check_filetype( $filename, $mimes );
				$ext				= $check_filetype['ext'];
				$type				= $check_filetype['type'];
				$proper_filename	= $filename;

				if ( $type && 0 === strpos( $type, 'image/' ) && $ext !== 'svg' ) {
					$ext = $type = false;
				}

				$checked = compact( 'ext','type','proper_filename' );
			}
			return $checked;
		}, 10, 4 );
	}
}
