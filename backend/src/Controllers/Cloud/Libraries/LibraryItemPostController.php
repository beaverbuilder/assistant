<?php

namespace FL\Assistant\Controllers\Cloud\Libraries;

use FL\Assistant\System\Contracts\ControllerAbstract;
use FL\Assistant\Data\Transformers\PostTransformer;
use FL\Assistant\Helpers\PostHelper;
use FL\Assistant\Services\MediaLibraryService;
use FL\Assistant\Clients\Cloud\CloudClient;

class LibraryItemPostController extends ControllerAbstract {

	protected $posts;

	/**
	 * Controller constructor.
	 *
	 * @return void
	 */
	public function __construct( PostTransformer $posts ) {
		$this->posts = $posts;
	}

	/**
	 * Register routes.
	 *
	 * @return void
	 */
	public function register_routes() {

		$this->route(
			'/posts/preview_library_post/(?P<item_id>\d+)',
			[
				[
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'preview_library_post' ],
					'args'                => [
						'item_id' => [
							'required' => true,
							'type'     => 'number',
						],
					],
					'permission_callback' => function () {
						return current_user_can( 'edit_others_posts' );
					},
				],
			]
		);

		$this->route(
			'/posts/(?P<id>\d+)/library/(?P<library_id>\d+)',
			[
				[
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'save_to_library' ],
					'args'                => [
						'id'         => [
							'required' => true,
							'type'     => 'number',
						],
						'library_id' => [
							'required' => true,
							'type'     => 'number',
						],
					],
					'permission_callback' => function () {
						return current_user_can( 'edit_others_posts' );
					},
				],
			]
		);

		$this->route(
			'/posts/import_from_library/(?P<item_id>\d+)',
			[
				[
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'import_from_library' ],
					'args'                => [
						'item_id' => [
							'required' => true,
							'type'     => 'number',
						],
						'import_media' => [
							'type'     => 'number',
							'default'  => 1,
						],
					],
					'permission_callback' => function () {
						return current_user_can( 'edit_others_posts' );
					},
				],
			]
		);

		$this->route(
			'/posts/(?P<id>\d+)/sync_from_library/(?P<item_id>\d+)',
			[
				[
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'sync_from_library' ],
					'args'                => [
						'id'            => [
							'required' => true,
							'type'     => 'number',
						],
						'item_id'       => [
							'required' => true,
							'type'     => 'number',
						],
						'import_media' => [
							'type'     => 'number',
							'default'  => 1,
						],
					],
					'permission_callback' => function () {
						return current_user_can( 'edit_others_posts' );
					},
				],
			]
		);
	}

	/**
	 * Handles previewing a post from a cloud library.
	 *
	 * @param object $request
	 * @return array
	 */
	public function preview_library_post( $request ) {
		global $wpdb;

		$item_id = $request->get_param( 'item_id' );

		$meta = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM $wpdb->postmeta
				WHERE meta_key = '_fl_asst_preview_library_item_id'
				AND meta_value = %s",
				$item_id
			)
		);

		if ( $meta ) {
			$request->set_param( 'id', $meta->post_id );
			$response = $this->sync_from_library( $request );
		} else {
			$response = $this->import_from_library( $request );
		}

		if ( isset( $response->data['error'] ) ) {
			return $response;
		}

		$post_id = $response->data['id'];

		wp_update_post(
			[
				'ID'          => $post_id,
				'post_status' => 'auto-draft',
			]
		);

		update_post_meta( $post_id, '_fl_asst_preview_library_item_id', $item_id );

		return rest_ensure_response(
			[
				'url' => PostHelper::get_preview_url( $post_id ),
			]
		);
	}

	/**
	 * Saves a post to a cloud library.
	 *
	 * @param object $request
	 * @return array
	 */
	public function save_to_library( $request ) {
		$id = $request->get_param( 'id' );
		$library_id = $request->get_param( 'library_id' );
		$post = get_post( $id );
		$client = new CloudClient;

		return $client->libraries->create_item(
			$library_id,
			[
				'name'       => $post->post_title,
				'type'       => 'post',
				'data'       => [
					'post'      => [
						'comment_status' 	=> $post->comment_status,
						'menu_order' 		=> $post->menu_order,
						'ping_status' 		=> $post->ping_status,
						'post_content' 		=> $post->post_content,
						'post_excerpt' 		=> $post->post_excerpt,
						'post_mime_type' 	=> $post->post_mime_type,
						'post_name' 		=> $post->post_name,
						'post_title' 		=> $post->post_title,
						'post_type' 		=> $post->post_type,
					],
					'meta'   => get_post_meta( $id ),
					'terms'  => $this->get_post_terms( $post ),

				],
				'media'      => [
					'thumb'       => get_attached_file( get_post_thumbnail_id( $post ) ),
					'attachments' => $this->get_post_image_paths( $post ),
				],
				'screenshot' => $this->get_post_screenshot( $request, $post ),
			],
		);
	}

	/**
	 * Imports a post from a library to the site.
	 *
	 * @param object $request
	 * @return array
	 */
	public function import_from_library( $request ) {
		$item_id = $request->get_param( 'item_id' );
		$import_media = !! $request->get_param( 'import_media' );
		$client = new CloudClient;
		$response = $client->libraries->get_item( $item_id );
		$post_data = $response->data->post;

		$new_post_id = wp_insert_post( [
			'comment_status' => $post_data->comment_status,
			'menu_order'     => $post_data->menu_order,
			'ping_status' 	 => $post_data->ping_status,
			'post_author'    => wp_get_current_user()->ID,
			'post_content'   => $post_data->post_content ? $post_data->post_content : '',
			'post_excerpt'	 => $post_data->post_excerpt ? $post_data->post_excerpt : '',
			'post_mime_type' => $post_data->post_mime_type,
			'post_name' 	 => $post_data->post_name,
			'post_status'    => 'draft',
			'post_title' 	 => $post_data->post_title,
			'post_type' 	 => $post_data->post_type,
		] );

		if ( is_wp_error( $new_post_id ) ) {
			return rest_ensure_response(
				[
					'error' => true,
				]
			);
		}

		$this->import_post_meta_from_library( $new_post_id, $response->data->meta );
		$this->import_post_terms_from_library( $new_post_id, $response->data->terms );
		$this->import_post_media_from_library( $new_post_id, $response->media, $import_media );

		return rest_ensure_response(
			$this->posts->transform(
				get_post( $new_post_id )
			)
		);
	}

	/**
	 * Syncs a library post with a post on the site.
	 *
	 * @param object $request
	 * @return array
	 */
	public function sync_from_library( $request ) {
		$post_id = $request->get_param( 'id' );
		$item_id = $request->get_param( 'item_id' );
		$import_media = !! $request->get_param( 'import_media' );
		$client = new CloudClient;
		$response = $client->libraries->get_item( $item_id );

		$updated = wp_update_post( [
			'ID' => $post_id,
			'post_content' => $response->data->post->post_content,
		] );

		if ( is_wp_error( $updated ) ) {
			return rest_ensure_response(
				[
					'error' => true,
				]
			);
		}

		$this->import_post_meta_from_library( $post_id, $response->data->meta );
		$this->import_post_terms_from_library( $post_id, $response->data->terms );
		$this->import_post_media_from_library( $post_id, $response->media, $import_media );

		return rest_ensure_response(
			$this->posts->transform(
				get_post( $post_id )
			)
		);
	}

	/**
	 * Imports meta for a library post to the site.
	 *
	 * @param int $post_id
	 * @param object $meta
	 * @return void
	 */
	public function import_post_meta_from_library( $post_id, $meta ) {
		global $wpdb;

		if ( ! $meta || ! is_object( $meta ) ) {
			return;
		}

		foreach ( $meta as $meta_key => $meta_value ) {
			if ( metadata_exists( 'post', $post_id, $meta_key ) ) {
				update_metadata( 'post', $post_id, $meta_key, maybe_unserialize( $meta_value[0] ) );
			} else {
				foreach ( $meta_value as $value ) {
					$value = addslashes( $value );
					// @codingStandardsIgnoreStart
					$wpdb->query( "INSERT INTO {$wpdb->postmeta} (post_id, meta_key, meta_value) values ({$post_id}, '{$meta_key}', '{$value}')" );
					// @codingStandardsIgnoreEnd
				}
			}
		}
	}

	/**
	 * Imports terms for a library post to the site.
	 *
	 * @param int $post_id
	 * @param array $terms
	 * @return void
	 */
	public function import_post_terms_from_library( $post_id, $terms ) {
		if ( ! $terms || ! is_array( $terms ) || 0 === count( $terms ) ) {
			return;
		}

		$taxonomies = get_taxonomies( '', 'objects' );

		foreach ( $terms as $term ) {
			if ( ! taxonomy_exists( $term->taxonomy ) ) {
				continue;
			}

			$existing_term = term_exists( $term->slug, $term->taxonomy );
			$is_hierarchical = !! $taxonomies[ $term->taxonomy ]->hierarchical;

			if ( is_array( $existing_term ) ) {
				$term_id = $is_hierarchical ? $existing_term['term_taxonomy_id'] : $term->name;
				wp_set_post_terms( $post_id, [ $term_id ], $term->taxonomy, true );
			} else {
				$new_term = wp_insert_term(
					$term->name,
					$term->taxonomy,
					[
						'description' => $term->description,
						'slug'        => $term->slug,
					]
				);
				$term_id = $is_hierarchical ? $new_term['term_taxonomy_id'] : $term->name;
				wp_set_post_terms( $post_id, [ $new_term['term_taxonomy_id'] ], $term->taxonomy, true );
			}
		}
	}

	/**
	 * Returns an array of all terms for a post.
	 *
	 * @param object $post
	 * @return array
	 */
	public function get_post_terms( $post ) {
		$taxonomies = get_taxonomies( '', 'names' );
		$object_terms = wp_get_object_terms( $post->ID, $taxonomies );
		$terms = [];

		foreach ( $object_terms as $term ) {
			$terms[] = [
				'description' 	=> $term->description,
				'name'			=> $term->name,
				'slug'			=> $term->slug,
				'taxonomy' 		=> $term->taxonomy,
			];
		}

		return $terms;
	}

	/**
	 * Returns the screenshot data for a post.
	 *
	 * @param object $request
	 * @param object $post
	 * @return array
	 */
	public function get_post_screenshot( $request, $post ) {
		$screenshot = $request->get_param( 'screenshot' );

		if ( $screenshot ) {
			return [
				'type' => 'base64',
				'data' => $screenshot,
			];
		}

		$url = PostHelper::get_preview_url( $post );
		$response = wp_remote_get(
			$url, [
				'cookies' => $_COOKIE,
			]
		);

		return [
			'type' => 'html',
			'html' => wp_remote_retrieve_body( $response ),
		];
	}

	/**
	 * Imports the media for a post.
	 *
	 * @param int $post_id
 	 * @param object $media
 	 * @param bool $import
	 * @return void
	 */
	public function import_post_media_from_library( $post_id, $media, $import = true ) {
		$service = new MediaLibraryService();

		// Import post thumbnail
		if ( $import && isset( $media->thumb ) && 'screenshot.png' !== $media->thumb->file_name ) {
			$response = $service->import_cloud_media( $media->thumb, $post_id );
			set_post_thumbnail( $post_id, $response['id'] );
		}

		// Import post attachments
		if ( isset( $media->attachments ) ) {
			$imported = [];

			foreach ( $media->attachments as $attachment ) {
				if ( $import ) {
					$response = $service->import_cloud_media( $attachment, $post_id );
					$imported[ $attachment->file_name ] = wp_get_attachment_metadata( $response['id'] );
					$imported[ $attachment->file_name ]['id'] = $response['id'];
				} else {
					$imported[ $attachment->file_name ] = $attachment;
				}
			}

			$this->replace_imported_attachment_urls_in_content( $post_id, $imported );
			$this->replace_imported_attachment_urls_in_meta( $post_id, $imported );
		}
	}

	/**
	 * Replaces the imported attachment urls in post content.
	 *
	 * @param int $post_id
 	 * @param array $imported
	 * @return void
	 */
	public function replace_imported_attachment_urls_in_content( $post_id, $imported ) {
		$content = get_post_field( 'post_content', $post_id );
		$content = $this->replace_imported_attachment_urls_in_string( $content, $imported );

		wp_update_post(
			[
				'ID'           => $post_id,
				'post_content' => $content,
			]
		);
	}

	/**
	 * Replaces the imported attachment urls in post meta.
	 *
	 * @param int $post_id
 	 * @param array $imported
	 * @return void
	 */
	public function replace_imported_attachment_urls_in_meta( $post_id, $imported ) {
		$meta = get_post_meta( $post_id );

		foreach ( $meta as $key => $val ) {
			$val = maybe_unserialize( $val[0] );

			if ( is_object( $val ) || is_array( $val ) ) {
				$val = $this->replace_imported_attachment_urls_in_data( $val, $imported );
			} else {
				$val = $this->replace_imported_attachment_urls_in_string( $val, $imported );
			}

			update_post_meta( $post_id, $key, $val );
		}
	}

	/**
	 * Replaces the imported attachment in an object or array.
	 *
 	 * @param object|array|string $data
 	 * @param array $imported
	 * @return object|array|string
	 */
	public function replace_imported_attachment_urls_in_data( $data, $imported ) {
		if ( is_object( $data ) || is_array( $data ) ) {
			foreach ( $data as $key => $val ) {
				if ( is_object( $val ) || is_array( $val ) ) {
					$new_val = $this->replace_imported_attachment_urls_in_data( $val, $imported );
				} else {
					$new_val = $this->replace_imported_attachment_urls_in_string( $val, $imported );
				}

				if ( is_object( $data ) ) {
					$data->$key = $new_val;
				} else {
					$data[ $key ] = $new_val;
				}
			}
		} else {
			$data = $this->replace_imported_attachment_urls_in_string( $data, $imported );
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
	public function replace_imported_attachment_urls_in_string( $string, $imported ) {
		$urls = $this->get_image_urls_from_string( $string );

		foreach ( $urls as $url ) {
			$url_info = $this->get_image_info_from_url( $url );

			if ( ! isset( $imported[ $url_info['file_name'] ] ) ) {
				continue;
			}

			$import_data = (array) $imported[ $url_info['file_name'] ];
			$sizes = $this->get_ordered_image_sizes( (array) $import_data['sizes'] );
			$new_url = null;

			if ( $url_info['width'] && $url_info['height'] ) {
				foreach ( $sizes as $size => $size_data ) {
					$size_data = (array) $size_data;
					if ( $url_info['width'] <= $size_data['width'] && $url_info['height'] <= $size_data['height'] ) {
						if ( isset( $size_data['url'] ) ) {
							$new_url = $size_data['url'];
							break;
						} else if ( isset( $import_data['id'] ) ) {
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
				} else if ( isset( $import_data['id'] ) ) {
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
	public function get_ordered_image_sizes( $sizes ) {
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
	 * Get the server paths to all images associated with a post.
	 *
	 * @param object $post
	 * @return array
	 */
	public function get_post_image_paths( $post ) {
		$content_urls = $this->get_image_urls_from_string( $post->post_content );
		$content_paths = $this->get_image_paths_from_urls( $content_urls );
		$meta = get_post_meta( $post->ID );
		$meta_paths = [];

		if ( $meta && count( $meta ) > 0 ) {
			$meta_urls = $this->get_image_urls_from_meta( $meta );
			$meta_paths = $this->get_image_paths_from_urls( $meta_urls );
		}

		return array_unique( array_merge( $content_paths, $meta_paths ) );
	}

	/**
	 * Get the server paths to all images in an array of urls.
	 *
	 * @param array $urls
	 * @return array
	 */
	public function get_image_paths_from_urls( $urls = [] ) {
		$paths = [];

		foreach ( $urls as $url ) {
			$path = $this->get_image_path_from_url( $url );
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
	public function get_image_path_from_url( $url ) {
		$upload_dir = wp_get_upload_dir();
		$base_url = preg_replace( '/https?:\/\//', '', $upload_dir['baseurl'] );
		$url_info = $this->get_image_info_from_url( $url );
		$url = preg_replace( '/https?:\/\//', '', $url_info['full_size_url'] );
		$path = null;

		if ( stristr( $url, $base_url ) ) {
			$path = $upload_dir['basedir'] . str_ireplace( $base_url, '', $url );
		}

		return $path;
	}

	/**
	 * Get the urls to all images in a post meta object.
	 *
	 * @param mixed $meta
	 * @return array
	 */
	public function get_image_urls_from_meta( $meta ) {
		$urls = [];

		foreach ( $meta as $key => $val ) {
			$val = maybe_unserialize( $val );

			if ( is_object( $val ) || is_array( $val ) ) {
				$urls = array_merge( $urls, $this->get_image_urls_from_meta( $val ) );
			} else {
				$urls = array_merge( $urls, $this->get_image_urls_from_string( $val ) );
			}
		}

		return $urls;
	}

	/**
	 * Get the urls to all images in a string.
	 *
	 * @param string $string
	 * @return array
	 */
	public function get_image_urls_from_string( $string ) {
		$pattern = '#http?://[^,\s()<>]+(?:\([\w\d]+\)|([^,[:punct:]\s]|/)\.(jpg|jpeg|png|gif))#';
		$urls = [];

		if ( preg_match_all( $pattern, $string, $matches ) ) {
			if ( isset( $matches[0] ) && ! empty( $matches[0] ) ) {
				$urls = $matches[0];
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
	public function get_image_info_from_url( $url ) {
		$info = [
			'url' 			=> $url,
			'full_size_url' => $url,
			'file_name' 	=> null,
			'width' 		=> null,
			'height' 		=> null,
			'ext'			=> null,
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
