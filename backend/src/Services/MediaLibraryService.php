<?php

namespace FL\Assistant\Services;

class MediaLibraryService {

	/**
	 * Checks if a media item was already imported.
	 *
	 * @param object $media
	 * @return int|null
	 */
	public function is_cloud_media_imported( $media ) {
		global $wpdb;

		// Check if a file with this name and sha1 hash exists.
		$parts = explode( '.', $media->file_name );
		$name = array_shift( $parts );

		$row = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM $wpdb->posts
				WHERE post_type = 'attachment'
				AND post_name = %s",
				$name
			)
		);

		if ( $row ) {
			$path = get_attached_file( $row->ID );
			if ( $path && sha1_file( $path ) === $media->upload_hash ) {
				return $row->ID;
			}
		}

		// Check if we've already imported this file using the original sha1.
		$row = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM $wpdb->postmeta
				WHERE meta_key = '_fl_asst_imported_media_hash'
				AND meta_value = %s",
				$media->upload_hash
			)
		);

		return $row ? $row->post_id : null;
	}

	/**
	 * Import an image into the media library.
	 */
	public function import_image( $url, $name, $post_id = 0 ) {
		require_once( ABSPATH . 'wp-admin/includes/image.php' );
		require_once( ABSPATH . 'wp-admin/includes/file.php' );
		require_once( ABSPATH . 'wp-admin/includes/media.php' );

		$url_filename = basename( parse_url( $url, PHP_URL_PATH ) );
		$tmp_path = wp_tempnam( $url_filename );

		if ( ! $tmp_path ) {
			return [ 'error' => __( 'Error creating temp file.' ) ];
		}

		$response = wp_remote_get(
			$url,
			[
				'timeout'   => 300,
				'stream'    => true,
				'filename'  => $tmp_path,
				'sslverify' => false,
			]
		);

		$response_code = wp_remote_retrieve_response_code( $response );

		if ( 200 !== intval( $response_code ) ) {
			@unlink( $tmp_path );
			return [ 'error' => __( 'Error downloading image file.' ) ];
		}

		$id = media_handle_sideload(
			[
				'name'     => sanitize_file_name( $name ),
				'tmp_name' => $tmp_path,
			],
			$post_id
		);

		if ( is_wp_error( $id ) ) {
			@unlink( $tmp_path );
			return [ 'error' => __( 'Error importing image file.' ) ];
		}

		return [
			'id'  => $id,
			'url' => wp_get_attachment_url( $id ),
		];
	}

	/**
	 * Import an svg file into the media library.
	 */
	public function import_svg_from_string( $xml, $name, $post_id = 0 ) {
		require_once( ABSPATH . 'wp-admin/includes/image.php' );
		require_once( ABSPATH . 'wp-admin/includes/file.php' );
		require_once( ABSPATH . 'wp-admin/includes/media.php' );

		$tmp_path = trailingslashit( WP_CONTENT_DIR ) . 'fl-asst-' . uniqid() . '.svg';
		$result = file_put_contents( $tmp_path, $xml );

		if ( false === $result ) {
			return [ 'error' => __( 'Error writing SVG file.' ) ];
		}

		$this->add_svg_import_filters();
		$id = media_handle_sideload(
			[
				'name'     => sanitize_file_name( $name ),
				'tmp_name' => $tmp_path,
			],
			$post_id
		);

		if ( is_wp_error( $id ) ) {
			@unlink( $tmp_path );
			return [ 'error' => __( 'Error importing SVG file.' ) ];
		}

		return [
			'id'  => $id,
			'url' => wp_get_attachment_url( $id ),
		];
	}

	/**
	 * WP core media filters for allowing svg upload.
	 */
	private function add_svg_import_filters() {
		add_filter(
			'upload_mimes', function( $mimes ) {
				$mimes['svg'] = 'image/svg+xml';
				$mimes['svgz'] = 'image/svg+xml';
				return $mimes;
			}, 99
		);

		add_filter(
			'wp_check_filetype_and_ext', function ( $checked, $file, $filename, $mimes ) {
				if ( ! $checked['type'] ) {
					$check_filetype     = wp_check_filetype( $filename, $mimes );
					$ext                = $check_filetype['ext'];
					$type               = $check_filetype['type'];
					$proper_filename    = $filename;

					if ( $type && 0 === strpos( $type, 'image/' ) && 'svg' !== $ext ) {
						$type = false;
						$ext = false;
					}

					$checked = compact( 'ext', 'type', 'proper_filename' );
				}
				return $checked;
			}, 10, 4
		);
	}
}
