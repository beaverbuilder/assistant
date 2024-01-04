<?php

namespace FL\Assistant\Services;

class MediaLibraryService {

	/**
	 * Checks if a cloud media item was already imported.
	 *
	 * @param object $media
	 * @return int|null
	 */
	public function is_cloud_media_imported( $media ) {
		global $wpdb;

		// Check if a file with this name and sha1 hash exists.
		$media = (object) $media;
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
	 * Import a cloud media item into the media library.
	 */
	public function import_cloud_media( $media, $post_id = 0 ) {
		$response = null;
		$media = (object) $media;
		$imported_id = $this->is_cloud_media_imported( $media );

		if ( $imported_id ) {
			return [
				'id'  => $imported_id,
				'url' => wp_get_attachment_url( $imported_id ),
			];
		}

		switch ( $media->mime_type ) {
			case 'image/jpg':
			case 'image/jpeg':
			case 'image/webp':
			case 'image/png':
			case 'image/gif':
			case 'application/pdf':
			case 'application/rtf':
			case 'text/rtf':
				$response = $this->import_file( $media->url, $media->file_name, $post_id );
				break;
			case 'image/svg':
			case 'image/svg+xml':
				$response = $this->import_svg( $media->url, $media->file_name, $post_id );
				break;
		}

		if ( $response && isset( $response['id'] ) ) {
			update_post_meta( $response['id'], '_fl_asst_imported_media_hash', $media->upload_hash );
		}

		return $response;
	}

	/**
	 * Import a file into the media library.
	 */
	public function import_file( $url, $name, $post_id = 0 ) {
		require_once( ABSPATH . 'wp-admin/includes/image.php' );
		require_once( ABSPATH . 'wp-admin/includes/file.php' );
		require_once( ABSPATH . 'wp-admin/includes/media.php' );

		$url_filename = basename( parse_url( $url, PHP_URL_PATH ) );
		$tmp_path = wp_tempnam( $url_filename );

		if ( ! $tmp_path ) {
			return [ 'error' => __( 'Error creating temp file.' ) ];
		}

		$response = wp_safe_remote_get(
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
			return [ 'error' => __( 'Error downloading file.' ) ];
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
			return [ 'error' => __( 'Error importing file.' ) ];
		}

		$alt_tag = $this->get_alt_tag_from_post_content( $post_id, $name );

		if ( !empty( $alt_tag ) ) {
			update_post_meta( $id, '_wp_attachment_image_alt', $alt_tag );
		}

		return [
			'id'  => $id,
			'url' => wp_get_attachment_url( $id ),
		];
	}

	/**
	 * Get the alt tag for a filename from the post content.
	 */
	public function get_alt_tag_from_post_content( $post_id, $filename ) {
		$content = get_post_field( 'post_content', $post_id );
		$alt_tag = null;

		if ( !empty( $content ) ) {
			$dom = new \DOMDocument();
			@$dom->loadHTML( $content );
			$images = $dom->getElementsByTagName( 'img' );

			foreach ( $images as $image ) {
				$src = $image->getAttribute( 'src' );
				$src_filename = basename( parse_url( $src, PHP_URL_PATH ) );

				// Remove dimensions to get the full size filename
				preg_match_all( '/(-(\d+)x(\d+))\.(jpg|jpeg|png|gif|svg)/', $src_filename, $matches );

				if ( isset( $matches[1] ) && ! empty( $matches[1] ) ) {
					$src_filename = str_replace( $matches[1], '', $src_filename );
				}

				if ( $src_filename === $filename ) {
					$alt_tag = $image->getAttribute( 'alt' );
					break;
				}
			}
		}

		return $alt_tag;
	}

	/**
	 * Import an svg file into the media library.
	 */
	public function import_svg( $url, $name, $post_id = 0 ) {
		$this->add_svg_import_filters();
		return $this->import_file( $url, $name, $post_id );
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
