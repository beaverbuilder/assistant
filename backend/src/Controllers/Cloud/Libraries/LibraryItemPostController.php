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
			'/posts/(?P<id>\d+)/sync_to_library/(?P<item_id>\d+)',
			[
				[
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'sync_to_library' ],
					'args'                => [
						'id'           => [
							'required' => true,
							'type'     => 'number',
						],
						'item_id'      => [
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
						'item_id'      => [
							'required' => true,
							'type'     => 'number',
						],
						'import_media' => [
							'type'    => 'number',
							'default' => 1,
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
						'id'           => [
							'required' => true,
							'type'     => 'number',
						],
						'item_id'      => [
							'required' => true,
							'type'     => 'number',
						],
						'import_media' => [
							'type'    => 'number',
							'default' => 1,
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
		return [
			'name'       => $post->post_title,
			'type'       => 'post',
			'data'       => [
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
				'thumb'       => get_attached_file( get_post_thumbnail_id( $post ) ),
				'attachments' => $this->get_post_image_paths( $post ),
			],
			'screenshot' => $this->get_post_screenshot( $request, $post ),
		];
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

		return $client->libraries->update_item(
			$item_id,
			$this->get_save_data( $request, $post )
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
		$import_media = ! ! $request->get_param( 'import_media' );
		$client = new CloudClient;
		$response = $client->libraries->get_item( $item_id );
		$post_data = $response->data->post;

		$new_post_id = wp_insert_post(
			[
				'comment_status' => $post_data->comment_status,
				'menu_order'     => $post_data->menu_order,
				'ping_status'    => $post_data->ping_status,
				'post_author'    => wp_get_current_user()->ID,
				'post_content'   => $post_data->post_content ? $post_data->post_content : '',
				'post_excerpt'   => $post_data->post_excerpt ? $post_data->post_excerpt : '',
				'post_mime_type' => $post_data->post_mime_type,
				'post_name'      => $post_data->post_name,
				'post_status'    => 'draft',
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

		$this->import_post_meta_from_library( $new_post_id, $response->data->meta );
		$this->import_post_terms_from_library( $new_post_id, $response->data->terms );
		$this->import_post_media_from_library( $new_post_id, $response->media, $import_media );
		$this->regenerate_builder_cache( $response );

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
		$item_id = $request->get_param( 'item_id' );
		$import_media = ! ! $request->get_param( 'import_media' );
		$client = new CloudClient;
		$response = $client->libraries->get_item( $item_id );

		$updated = wp_update_post(
			[
				'ID'           => $post_id,
				'post_content' => $response->data->post->post_content,
			]
		);

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
		$this->regenerate_builder_cache( $response );

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
				delete_metadata( 'post', $post_id, $meta_key );
			}

			foreach ( $meta_value as $value ) {
				$value = addslashes( $value );
				// @codingStandardsIgnoreStart
				$wpdb->query( "INSERT INTO {$wpdb->postmeta} (post_id, meta_key, meta_value) values ({$post_id}, '{$meta_key}', '{$value}')" );
				// @codingStandardsIgnoreEnd
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
		$taxonomy_terms = [];

		foreach ( $terms as $term ) {
			if ( ! isset( $term->name ) || ! isset( $term->taxonomy ) ) {
				continue;
			} else if ( ! taxonomy_exists( $term->taxonomy ) ) {
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

			$taxonomy_terms[ $term->taxonomy ] = $term_id;
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
		return ScreenshotHelper::get_for_request( $request, $url );
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
	public function regenerate_builder_cache( $item ) {
		$meta = (array) $item->data->meta;

		if ( isset( $meta['_elementor_data'] ) && class_exists( 'Elementor\Plugin' ) ) {
			\Elementor\Plugin::$instance->files_manager->clear_cache();
		}
	}
}
