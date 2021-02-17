<?php

namespace FL\Assistant\Helpers;

use FL\Assistant\Helpers\JsonHelper;

class MediaPathHelper {

	/**
	 * Replaces the imported attachment in an object or array.
	 *
	 * @param object|array|string $data
	 * @param array $imported
	 * @return object|array|string
	 */
	static public function replace_imported_attachment_urls_in_data( $data, $imported ) {
		if ( is_object( $data ) || is_array( $data ) ) {
			foreach ( $data as $key => $val ) {
				if ( is_object( $val ) || is_array( $val ) ) {
					$new_val = self::replace_imported_attachment_urls_in_data( $val, $imported );
				} else {
					$new_val = self::replace_imported_attachment_urls_in_string( $val, $imported );
				}

				if ( is_object( $data ) ) {
					$data->$key = $new_val;
				} else {
					$data[ $key ] = $new_val;
				}
			}
		} else {
			$data = self::replace_imported_attachment_urls_in_string( $data, $imported );
		}

		return $data;
	}

	/**
	 * Replaces the imported attachment in a string.
	 *
	 * @param string $string
	 * @param array $imported
	 * @return string
	 */
	static public function replace_imported_attachment_urls_in_string( $string, $imported ) {
		$urls = self::get_image_urls_from_string( $string );

		foreach ( $urls as $url ) {
			$url_info = self::get_image_info_from_url( $url );

			if ( ! isset( $imported[ $url_info['file_name'] ] ) ) {
				continue;
			}

			$import_data = (array) $imported[ $url_info['file_name'] ];
			$sizes = self::get_ordered_image_sizes( (array) $import_data['sizes'] );
			$new_url = null;

			if ( $url_info['width'] && $url_info['height'] ) {
				foreach ( $sizes as $size => $size_data ) {
					$size_data = (array) $size_data;
					if ( $url_info['width'] <= $size_data['width'] && $url_info['height'] <= $size_data['height'] ) {
						if ( isset( $size_data['url'] ) ) {
							$new_url = $size_data['url'];
							break;
						} elseif ( isset( $import_data['id'] ) ) {
							$size_src = wp_get_attachment_image_src( $import_data['id'], $size );
							if ( $size_src ) {
								$new_url = $size_src[0];
								break;
							}
						}
					}
				}
			}

			if ( ! $new_url ) {
				if ( isset( $import_data['url'] ) ) {
					$new_url = $import_data['url'];
				} elseif ( isset( $import_data['id'] ) ) {
					$new_url = wp_get_attachment_url( $import_data['id'] );
				}
			}

			if ( $new_url ) {
				$string = str_replace( $url, $new_url, $string );
			}
		}

		return $string;
	}

	/**
	 * Returns an array or ordered image sizes.
	 *
	 * @param array $sizes
	 * @return array
	 */
	static public function get_ordered_image_sizes( $sizes ) {
		$keys = [];
		$ordered = [];

		foreach ( $sizes as $size => $data ) {
			if ( 'thumb' === $size || 'thumbnail' === $size ) {
				continue;
			}
			$data = (array) $data;
			$key = $data['width'] + $data['height'];
			$keys[ $key ] = $size;
		}

		ksort( $keys );

		foreach ( $keys as $key ) {
			$ordered[ $key ] = $sizes[ $key ];
		}

		return $ordered;
	}

	/**
	 * Get the server paths to all images in a string.
	 *
	 * @param string $string
	 * @return array
	 */
	static public function get_image_paths_from_string( $string ) {
		$urls = self::get_image_urls_from_string( $string );
		$paths = self::get_image_paths_from_urls( $urls );
		return $paths;
	}

	/**
	 * Get the server paths to all images in an array or object.
	 *
	 * @param mixed $data
	 * @return array
	 */
	static public function get_image_paths_from_data( $data ) {
		$urls = self::get_image_urls_from_data( $data );
		$paths = self::get_image_paths_from_urls( $urls );
		return $paths;
	}

	/**
	 * Get the server paths to all images in an array of urls.
	 *
	 * @param array $urls
	 * @return array
	 */
	static public function get_image_paths_from_urls( $urls = [] ) {
		$paths = [];

		foreach ( $urls as $url ) {
			$path = self::get_image_path_from_url( $url );
			if ( $path ) {
				$paths[] = $path;
			}
		}

		return $paths;
	}

	/**
	 * Converts a media library URL to the server path of the full size image.
	 *
	 * @param string $url
	 * @return string
	 */
	static public function get_image_path_from_url( $url ) {
		$upload_dir = wp_get_upload_dir();
		$base_url = preg_replace( '/https?:\/\//', '', $upload_dir['baseurl'] );
		$url_info = self::get_image_info_from_url( $url );
		$url = preg_replace( '/https?:\/\//', '', $url_info['full_size_url'] );
		$path = null;

		if ( stristr( $url, $base_url ) ) {
			$path = $upload_dir['basedir'] . str_ireplace( $base_url, '', $url );
		}

		return $path;
	}

	/**
	 * Get the urls to all images in a string.
	 *
	 * @param string $string
	 * @return array
	 */
	static public function get_image_urls_from_string( $string ) {
		$pattern = '#https?://[^,\s()<>]+(?:\([\w\d]+\)|([^,[:punct:]\s]|/)\.(jpg|jpeg|png|gif))#';
		$urls = [];

		if ( preg_match_all( $pattern, $string, $matches ) ) {
			if ( isset( $matches[0] ) && ! empty( $matches[0] ) ) {
				$urls = $matches[0];
			}
		}

		return $urls;
	}

	/**
	 * Get the urls to all images in an object or array.
	 *
	 * @param mixed $data
	 * @return array
	 */
	static public function get_image_urls_from_data( $data ) {
		$urls = [];

		foreach ( $data as $key => $val ) {
			$val = maybe_unserialize( $val );

			if ( is_object( $val ) || is_array( $val ) ) {
				$urls = array_merge( $urls, self::get_image_urls_from_data( $val ) );
			} elseif ( JsonHelper::is_string_json( $val ) ) {
				$val = wp_unslash( $val );
				$urls = array_merge( $urls, self::get_image_urls_from_string( $val ) );
			} else {
				$urls = array_merge( $urls, self::get_image_urls_from_string( $val ) );
			}
		}

		return $urls;
	}

	/**
	 * Get the info for a media library image from a url.
	 *
	 * @param string $url
	 * @return array
	 */
	static public function get_image_info_from_url( $url ) {
		$info = [
			'url'           => $url,
			'full_size_url' => $url,
			'file_name'     => null,
			'width'         => null,
			'height'        => null,
			'ext'           => null,
		];

		preg_match_all( '/(-(\d+)x(\d+))\.(jpg|jpeg|png|gif)/', $url, $matches );

		if ( isset( $matches[1] ) && ! empty( $matches[1] ) ) {
			$info['full_size_url'] = str_replace( $matches[1], '', $url );
		}

		$parts = explode( '/', $info['full_size_url'] );
		$info['file_name'] = array_pop( $parts );

		if ( isset( $matches[2] ) && ! empty( $matches[2] ) ) {
			$info['width'] = $matches[2][0];
		}
		if ( isset( $matches[3] ) && ! empty( $matches[3] ) ) {
			$info['height'] = $matches[3][0];
		}
		if ( isset( $matches[4] ) && ! empty( $matches[4] ) ) {
			$info['ext'] = $matches[4][0];
		}

		return $info;
	}
}
