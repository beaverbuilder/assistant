<?php

namespace FL\Assistant\Controllers\Cloud\Libraries;

use FL\Assistant\System\Contracts\ControllerAbstract;
use FL\Assistant\System\View;
use FL\Assistant\Data\Transformers\PostTransformer;
use FL\Assistant\Services\MediaLibraryService;
use FL\Assistant\Helpers\PostHelper;
use FL\Assistant\Clients\Cloud\CloudClient;

class LibraryItemPostController extends ControllerAbstract {

	protected $posts;
	protected $view;
	protected $raw_media = [];
	protected $postmeta_images = [];
	protected $output = [];

	/**
	 * Controller constructor.
	 *
	 * @return void
	 */
	public function __construct( PostTransformer $posts, View $view ) {
		$this->posts = $posts;
		$this->view = $view;
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
					'meta'      => get_post_meta( $id ),
					'terms'     => $this->get_post_terms( $post ),
					'raw_media' => $this->raw_media,

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
		$client = new CloudClient;
		$response = $client->libraries->get_item( $item_id );
		$post_data = $response->data->post;

		$new_post_id = wp_insert_post( [
			'comment_status' => $post_data->comment_status,
			'menu_order'     => $post_data->menu_order,
			'ping_status' 	 => $post_data->ping_status,
			'post_author'    => wp_get_current_user()->ID,
			'post_content'   => $post_data->post_content,
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
	 * @param array $meta
	 * @return void
	 */
	public function import_post_meta_from_library( $post_id, $meta ) {
		global $wpdb;

		if ( ! $meta || ! is_object( $meta ) ) {
			return;
		}

		foreach ( $meta as $meta_key => $meta_value ) {
			if ( metadata_exists( 'post', $post_id, $meta_key ) ) {
				update_metadata( 'post', $post_id, $meta_key, $meta_value );
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
	 * @param object $post
	 * @return array
	 */
	public function get_post_image_paths( $post ) {
		$content_image_paths = $this->get_post_content_image_paths( $post->post_content );
		$meta_image_paths = $this->get_post_meta_image_paths( $post );
		$all_image_paths = array_merge( $content_image_paths, $meta_image_paths );
		return array_values( array_unique( $all_image_paths ) );
	}

	/**
	 * @param string $content
	 * @return array
	 */
	public function get_post_content_image_paths( $content = '' ) {
		preg_match_all( '@src="([^"]+)"@', $content, $matches );
		$urls = array_pop( $matches );
		$paths = $this->get_image_paths_from_urls( $urls );
		array_push( $this->raw_media, $urls );
		return $paths;
	}

	/**
	 * @param object $post
	 * @return array
	 */
	public function get_post_meta_image_paths( $post ) {
		$meta = get_post_meta( $post->ID );
		$paths = [];

		if ( $meta && count( $meta ) > 0 ) {
			$urls = $this->get_image_urls_from_meta( $meta );
			$paths = $this->get_image_paths_from_urls( $urls );
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
		$url = preg_replace( '/https?:\/\//', '', $url );
		$path = null;

		// Make sure we have the full size image url...
		preg_match_all( '/(-\d+x\d+)\.(jpg|jpeg|png|gif)/', $url, $matches );

		if ( isset( $matches[1] ) && ! empty( $matches[1] ) ) {
			$url = str_replace( $matches[1], '', $url );
		}

		if ( stristr( $url, $base_url ) ) {
			$path = $upload_dir['basedir'] . str_ireplace( $base_url, '', $url );
		}

		return $path;
	}

	/**
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
	 * @param string $string
	 * @return array
	 */
	public function get_image_urls_from_string( $string ) {
		$pattern = '#http?://[^,\s()<>]+(?:\([\w\d]+\)|([^,[:punct:]\s]|/)\.(jpg|jpeg|png|gif))#';
		$urls = [];

		if ( preg_match_all( $pattern, $string, $matches ) ) {
			if ( isset( $matches[0] ) && ! empty( $matches[0] ) ) {
				$urls = $matches[0];
				array_push( $this->raw_media, $matches[0] );
			}
		}

		return $urls;
	}

	/**
	 * @param array $input
 	 * @param string $search
 	 * @param string $replace
 	 * @param string $pos_needle
	 * @return array
	 */
	public function search_replace_array( $input = [], $search = '', $replace = '', $pos_needle = '' ) {

		if ( is_object( $input ) || is_array( $input ) ) {

			foreach ( $input as $key => $val ) {

				if ( is_object( $val ) || is_array( $val ) ) {

					$this->search_replace_array( $val, $search, $replace );

				} else {

						$value = str_replace( $search, $replace, $val );

					if ( is_object( $input ) ) {
						$input->$key = $value;
					} else {
						$input[ $key ] = $value;
					}
				}
			}
		}

		return $input;

	}
}
