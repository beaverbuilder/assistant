<?php

namespace FL\Assistant\Controllers\Cloud\Libraries;

use FL\Assistant\System\Contracts\ControllerAbstract;
use FL\Assistant\Data\Transformers\PostTransformer;
use FL\Assistant\Helpers\PreviewHelper;
use FL\Assistant\Helpers\JsonHelper;
use FL\Assistant\Helpers\MediaPathHelper;
use FL\Assistant\Helpers\ScreenshotHelper;
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
			'/posts/preview_library_post/',
			[
				[
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'preview_library_post' ],
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
			'/posts/(?P<id>\d+)/sync_to_library/(?P<item_id>\d+)',
			[
				[
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'sync_to_library' ],
					'args'                => [
						'id'      => [
							'required' => true,
							'type'     => 'number',
						],
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
			'/posts/import_from_library/',
			[
				[
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'import_from_library' ],
					'permission_callback' => function () {
						return current_user_can( 'edit_others_posts' );
					},
				],
			]
		);

		$this->route(
			'/posts/import_post_thumb_from_library/(?P<post_id>\d+)',
			[
				[
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'import_post_thumb_from_library' ],
					'args'                => [
						'post_id' => [
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
			'/posts/import_post_media_from_library/(?P<post_id>\d+)',
			[
				[
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'import_post_media_from_library' ],
					'args'                => [
						'post_id' => [
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
			'/posts/(?P<id>\d+)/sync_from_library/',
			[
				[
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'sync_from_library' ],
					'args'                => [
						'id' => [
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

		$data = $request->get_param( 'item' );
		$item = $data ? json_decode( $data ) : null;

		if ( ! $item ) {
			return rest_ensure_response(
				[
					'error' => true,
				]
			);
		}

		$meta = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM $wpdb->postmeta
				WHERE meta_key = '_fl_asst_preview_library_item_id'
				AND meta_value = %s",
				$item->id
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

		update_post_meta( $post_id, '_fl_asst_preview_library_item_id', $item->id );

		$this->replace_attachment_urls_with_cloud_urls( $item, $post_id );

		return rest_ensure_response(
			[
				'url' => PreviewHelper::get_post_preview_url( $post_id ),
			]
		);
	}

	/**
	 * Gets the data for saving to a library or updating a library item.
	 *
	 * @param object $request
	 * @param object $post
	 * @return array
	 */
	public function get_save_data( $request, $post ) {
		$data = [
			'name'       => $post->post_title,
			'type'       => 'post',
			'post_data'       => [
				'post'  => [
					'comment_status' => $post->comment_status,
					'menu_order'     => $post->menu_order,
					'ping_status'    => $post->ping_status,
					'post_content'   => $post->post_content,
					'post_excerpt'   => $post->post_excerpt,
					'post_mime_type' => $post->post_mime_type,
					'post_name'      => $post->post_name,
					'post_title'     => $post->post_title,
					'post_type'      => $post->post_type,
				],
				'meta'  => get_post_meta( $post->ID ),
				'terms' => $this->get_post_terms( $post ),

			],
			'media'      => [
				'attachments' => $this->get_post_image_paths( $post ),
			],
			'screenshot' => $this->get_post_screenshot( $request, $post ),
		];

		$thumbnail = get_attached_file( get_post_thumbnail_id( $post ) );

		if ($thumbnail) {
			$data['media']['thumb'] = $thumbnail;
		}

		return $data;
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
			$this->get_save_data( $request, $post )
		);
	}

	/**
	 * Replaces a library post with a post on this site.
	 *
	 * @param object $request
	 * @return array
	 */
	public function sync_to_library( $request ) {
		$id = $request->get_param( 'id' );
		$item_id = $request->get_param( 'item_id' );
		$post = get_post( $id );
		$client = new CloudClient;
		$data = $this->get_save_data( $request, $post );

		return $client->libraries->update_item(
			$item_id,
			$data
		);
	}

	/**
	 * Imports a post from a library to the site.
	 *
	 * @param object $request
	 * @return array
	 */
	public function import_from_library( $request ) {
		$data = $request->get_param( 'item' );
		$item = $data ? json_decode( $data ) : null;

		if ( ! $item ) {
			return rest_ensure_response(
				[
					'error' => true,
				]
			);
		}

		$client = new CloudClient;
		$item = $client->libraries->get_item( $item->id );

		$registered_post_types = get_post_types();

		if ( ! in_array( $item->data->post->post_type, $registered_post_types ) ) {
			return rest_ensure_response(
				[
					'error' => true,
					'error_code' => 'post_type_not_registered',
					'post_type' => $item->data->post->post_type,
				]
			);
		}

		$post_data = $item->data->post;
		$meta_data = $item->data->meta;
		$term_data = $item->data->terms;

		$new_post_id = wp_insert_post(
			[
				'comment_status' => $post_data->comment_status,
				'menu_order'     => $post_data->menu_order,
				'ping_status'    => $post_data->ping_status,
				'post_author'    => wp_get_current_user()->ID,
				'post_content'   => $post_data->post_content ? $post_data->post_content : '',
				'post_excerpt'   => $post_data->post_excerpt ? $post_data->post_excerpt : '',
				'post_mime_type' => $post_data->post_mime_type ? $post_data->post_mime_type : '',
				'post_name'      => $post_data->post_name,
				'post_status'    => 'publish',
				'post_title'     => $post_data->post_title,
				'post_type'      => $post_data->post_type,
			]
		);

		if ( is_wp_error( $new_post_id ) ) {
			return rest_ensure_response(
				[
					'error' => true,
				]
			);
		}

		$this->import_post_meta_from_library( $new_post_id, $meta_data );
		$this->import_post_terms_from_library( $new_post_id, $term_data );
		$this->regenerate_builder_cache( $new_post_id, $item );

		return rest_ensure_response(
			$this->posts->transform(
				get_post( $new_post_id )
			)
		);
	}

	/**
	 * Replaces a post on this site with a post from a library.
	 *
	 * @param object $request
	 * @return array
	 */
	public function sync_from_library( $request ) {
		$post_id = $request->get_param( 'id' );
		$data = $request->get_param( 'item' );
		$item = $data ? json_decode( $data ) : null;

		if ( ! $item ) {
			return rest_ensure_response(
				[
					'error' => true,
				]
			);
		}

		$client = new CloudClient;
		$item = $client->libraries->get_item( $item->id );
		$post_data = $item->data->post;
		$meta_data = $item->data->meta;
		$term_data = $item->data->terms;

		$updated = wp_update_post(
			[
				'ID'           => $post_id,
				'post_content' => $post_data->post_content,
			]
		);

		if ( is_wp_error( $updated ) ) {
			return rest_ensure_response(
				[
					'error' => true,
				]
			);
		}

		$this->import_post_meta_from_library( $post_id, $meta_data );
		$this->import_post_terms_from_library( $post_id, $term_data );
		$this->regenerate_builder_cache( $post_id, $item );

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

		if ( isset( $meta->_fl_builder_data ) ) {
			$meta->_fl_builder_draft = $meta->_fl_builder_data;
			$meta->_fl_builder_draft_settings = $meta->_fl_builder_data_settings;
		}

		foreach ( $meta as $meta_key => $meta_value ) {
			if ( metadata_exists( 'post', $post_id, $meta_key ) ) {
				delete_metadata( 'post', $post_id, $meta_key );
			}
			if ( is_array( $meta_value ) && count( $meta_value ) !== 0 ) {
				foreach ( $meta_value as $value ) {
					if ( $value !== null ) {
						$value = addslashes( $value );
					}
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
		$terms = is_object( $terms ) ? [ $terms ] : $terms;

		if ( ! $terms || ! is_array( $terms ) || 0 === count( $terms ) ) {
			return;
		}

		$taxonomies = get_taxonomies( '', 'objects' );
		$taxonomy_terms = [];

		foreach ( $terms as $term ) {
			if ( ! isset( $term->name ) || ! isset( $term->taxonomy ) ) {
				continue;
			} elseif ( ! taxonomy_exists( $term->taxonomy ) ) {
				continue;
			} elseif ( ! isset( $taxonomy_terms ) ) {
				$taxonomy_terms[ $term->taxonomy ] = [];
			}

			$existing_term = term_exists( $term->slug, $term->taxonomy );
			$is_hierarchical = ! ! $taxonomies[ $term->taxonomy ]->hierarchical;

			if ( is_array( $existing_term ) ) {
				$term_id = $is_hierarchical ? $existing_term['term_taxonomy_id'] : $term->name;
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
			}

			$taxonomy_terms[ $term->taxonomy ][] = $term_id;
		}

		foreach ( $taxonomy_terms as $taxonomy => $terms ) {
			wp_delete_object_term_relationships( $post_id, $taxonomy );
			wp_set_post_terms( $post_id, $terms, $taxonomy, true );
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
				'description' => $term->description,
				'name'        => $term->name,
				'slug'        => $term->slug,
				'taxonomy'    => $term->taxonomy,
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
		$url = PreviewHelper::get_post_preview_url( $post );
		$url = add_query_arg( 'fl_asst_screenshot', '1', $url );
		return ScreenshotHelper::get_for_rest_request( $request, $url );
	}

	/**
	 * Imports the featured image for a post.
	 *
	 * @param object $request
	 * @return array
	 */
	public function import_post_thumb_from_library( $request ) {
		$post_id = $request->get_param( 'post_id' );
		$thumb = $request->get_param( 'thumb' );
		$service = new MediaLibraryService();

		if ( ! preg_match( '/screenshot\.(png|jpg|gif)/', $thumb['file_name'] ) ) {
			$response = $service->import_cloud_media( $thumb, $post_id );
			set_post_thumbnail( $post_id, $response['id'] );
		}

		return [ 'success' => true ];
	}

	/**
	 * Imports a media item for a post.
	 *
	 * @param object $request
	 * @return array
	 */
	public function import_post_media_from_library( $request ) {
		$post_id = $request->get_param( 'post_id' );
		$media = $request->get_param( 'media' );
		$service = new MediaLibraryService();

		$imported = [];
		$response = $service->import_cloud_media( $media, $post_id );
		$imported[ $media['file_name'] ] = wp_get_attachment_metadata( $response['id'] );
		$imported[ $media['file_name'] ]['id'] = $response['id'];

		$this->replace_imported_attachment_urls_in_content( $post_id, $imported );
		$this->replace_imported_attachment_urls_in_meta( $post_id, $imported );

		return [ 'success' => true ];
	}

	/**
	 * Replace attachment urls with urls from the cloud.
	 *
	 * @param object $item
	 * @param int $post_id
	 * @return void
	 */
	public function replace_attachment_urls_with_cloud_urls( $item, $post_id ) {
		if ( isset( $item->media->attachments ) ) {
			$imported = [];

			foreach ( $item->media->attachments as $attachment ) {
				$imported[ $attachment->file_name ] = $attachment;
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
		$content = MediaPathHelper::replace_imported_attachment_urls_in_string( $content, $imported );

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
				$val = MediaPathHelper::replace_imported_attachment_urls_in_data( $val, $imported );
			} elseif ( JsonHelper::is_string_json( $val ) ) {
				$val = json_decode( $val );
				$val = MediaPathHelper::replace_imported_attachment_urls_in_data( $val, $imported );
				$val = wp_slash( json_encode( $val ) );
			} else {
				$val = MediaPathHelper::replace_imported_attachment_urls_in_string( $val, $imported );
			}

			update_post_meta( $post_id, $key, $val );
		}
	}

	/**
	 * Get the server paths to all images associated with a post.
	 *
	 * @param object $post
	 * @return array
	 */
	public function get_post_image_paths( $post ) {
		$content_paths = MediaPathHelper::get_image_paths_from_string( $post->post_content );
		$meta = get_post_meta( $post->ID );
		$meta_paths = [];

		if ( $meta && count( $meta ) > 0 ) {
			$meta_paths = MediaPathHelper::get_image_paths_from_data( $meta );
		}

		return array_unique( array_merge( $content_paths, $meta_paths ) );
	}

	/**
	 * Regenerate the asset cache for posts created with a builder.
	 *
	 * @param object $item
	 * @return void
	 */
	public function regenerate_builder_cache( $post_id, $item ) {
		$meta = (array) $item->data->meta;

		if ( isset( $meta['_fl_builder_data'] ) && class_exists( 'FLBuilderModel' ) ) {
			\FLBuilderModel::delete_all_asset_cache( $post_id );
		}
		if ( isset( $meta['_elementor_data'] ) && class_exists( 'Elementor\Plugin' ) ) {
			\Elementor\Plugin::$instance->files_manager->clear_cache();
		}
	}
}
