<?php

namespace FL\Assistant\Controllers;

use FL\Assistant\System\Contracts\ControllerAbstract;
use FL\Assistant\System\View;
use FL\Assistant\Data\Transformers\PostTransformer;
use WP_REST_Server;

/**
 * REST API logic for exporting posts.
 */
class CloudPostsController extends ControllerAbstract {

	protected $posts;
	protected $view;

	public function __construct( PostTransformer $posts, View $view ) {
		$this->posts = $posts;
		$this->view = $view;
	}

	/**
	 * Register routes.
	 */
	public function register_routes() {

		$this->route(
			'/posts/import_from_library/(?P<item_id>\d+)',
			[
				[
					'methods'             => WP_REST_Server::CREATABLE,
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
			'/posts/sync_from_library/(?P<id>\d+)/(?P<item_id>\d+)/(?P<override_type>\d+)',
			[
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'override_lib_post' ],
					'args'                => [
						'id'            => [
							'required' => true,
							'type'     => 'number',
						],
						'item_id'       => [
							'required' => true,
							'type'     => 'number',
						],
						'override_type' => [
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
					'methods'             => WP_REST_Server::CREATABLE,
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
	}



	function sync_from_library( $request ) {

		global $wpdb;
		$post_id = $request->get_param( 'id' );
		$item_id = $request->get_param( 'item_id' );
		$override_type = $request->get_param( 'override_type' );

		$client = new \FL\Assistant\Clients\Cloud\CloudClient;
		$response = $client->libraries->getItem( $item_id );

		$post_data = $response->data->post;
		$post_meta = $response->data->meta;
		$post_terms  = $response->data->terms;

		$override_post = [];
		$override_post['ID'] = $post_id;

		if ( $post_meta && count( $post_meta ) !== 0 ) {

			foreach ( $post_meta as $key => $meta_value ) {

				$meta_key   = $key ? $key : '';



				if ( '' !== $meta_key ) {
					if ( metadata_exists( 'post', $post_id, '_' . $meta_key ) ) {

						update_metadata( 'post', $post_id, $meta_key, $meta_value );

					} else {
						if( count( $meta_value ) >= 1 ){
							foreach( $meta_value as $value ){
								$value = $value ? addslashes( $value ) : '';
								$wpdb->query( "INSERT INTO {$wpdb->postmeta} (post_id, meta_key, meta_value) values ({$post_id}, '{$meta_key}', '{$value}')" ); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared

							}
						}
					}
				}
			}
		}

		if ( '2' === $override_type ) {

			$override_post['post_content'] = $post_data->post_content;
		} elseif ( '3' === $override_type ) {

			if ( is_array( $post_terms ) && count( $post_terms ) !== 0 ) {

				foreach ( $post_terms as $category ) {
					if ( taxonomy_exists( $category->taxonomy ) ) {
						$term = term_exists( $category->slug, $category->taxonomy );
						if ( $term !== 0 && $term !== null ) {
							wp_set_post_terms( $new_post_id, [ $term['term_taxonomy_id'] ], $category->taxonomy, true );
						} else {
							wp_insert_term(
								$category->name,   // the term
								$category->taxonomy, // the taxonomy
								[
									'description' => $category->description,
									'slug'        => $category->slug,
									'parent'      => $category->parent,
								]
							);

							wp_set_post_terms( $new_post_id, [ $term['term_taxonomy_id'] ], $category->taxonomy, true );
						}
					}
				}
			}
		} else {

			$override_post['post_content'] = $post_data->post_content;
			if ( is_array( $post_terms ) && count( $post_terms ) !== 0 ) {

				foreach ( $post_terms as $category ) {
					if ( taxonomy_exists( $category->taxonomy ) ) {
						$term = term_exists( $category->slug, $category->taxonomy );
						if ( $term !== 0 && $term !== null ) {
							wp_set_post_terms( $new_post_id, [ $term['term_taxonomy_id'] ], $category->taxonomy, true );
						} else {
							wp_insert_term(
								$category->name,   // the term
								$category->taxonomy, // the taxonomy
								[
									'description' => $category->description,
									'slug'        => $category->slug,
									'parent'      => $category->parent,
								]
							);

							wp_set_post_terms( $new_post_id, [ $term['term_taxonomy_id'] ], $category->taxonomy, true );
						}
					}
				}
			}
		}

		if ( is_wp_error( wp_update_post( $override_post ) ) ) {

			return rest_ensure_response(
				[
					'error' => true,
				]
			);
		} else {
			return rest_ensure_response(
				[
					'success' => true,
				]
			);
		}

	}



	function save_to_library( $request ) {
		$id = $request->get_param( 'id' );
		$library_id = $request->get_param( 'library_id' );

		$post = get_post( $id );
		$client = new \FL\Assistant\Clients\Cloud\CloudClient;

		$media_path = get_attached_file( get_post_thumbnail_id( $post ) );

		$taxonomies = get_taxonomies( '', 'names' );
		$post_taxonomies = wp_get_object_terms( $id, $taxonomies );

		$comments = get_comments( [ 'post_id' => $id ] );

		return $client->libraries->createItem(
			$library_id,
			[
				'name'  => $post->post_title,
				'type'  => 'post',
				'data'  => [
					'post'     => $post,
					'meta'     => get_post_meta( $id ),
					'terms'    => $post_taxonomies,
					'comments' => $comments,
				],
			],
			[
				$media_path
			]
		);
	}


	function import_from_library( $request ) {

		global $wpdb;

		$item_id = $request->get_param( 'item_id' );
		$client = new \FL\Assistant\Clients\Cloud\CloudClient;
		$response = $client->libraries->getItem( $item_id );
		$post_data = $response->data->post;
		$post_meta = $response->data->meta;
		$post_terms  = $response->data->terms;
		$current_user = wp_get_current_user();

		$newpost_data = [
			'post_author'    => $current_user->ID,
			'post_content'   => $post_data->post_content ? $post_data->post_content : '',
			'post_excerpt'   => $post_data->post_excerpt ? $post_data->post_excerpt : '',
			'post_name'      => $post_data->post_name ? $post_data->post_name : '',
			'post_status'    => 'draft',
			'post_title'     => $post_data->post_title,
			'post_type'      => $post_data->post_type,
			'menu_order'     => $post_data->menu_order,
			'post_mime_type' => $post_data->post_mime_type,
		];

		$new_post_id = wp_insert_post( $newpost_data );

		if ( is_wp_error( $new_post_id ) ) {

			return rest_ensure_response(
				[
					'error' => true,
				]
			);

		} else {

			if ( $post_meta && count( $post_meta ) !== 0 ) {

				foreach ( $post_meta as $key => $meta_value ) {

					$meta_key   = $key ? $key : '';


					if ( '' !== $meta_key ) {
						if ( count( $meta_value ) >= 1 ) {
							foreach ( $meta_value as $value ) {
								$value = $value ? addslashes( $value ) : '';
								$wpdb->query( "INSERT INTO {$wpdb->postmeta} (post_id, meta_key, meta_value) values ({$new_post_id}, '{$meta_key}', '{$value}')" ); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
							}
						}


					}
				}
			}

			if ( is_array( $post_terms ) && count( $post_terms ) !== 0 ) {

				foreach ( $post_terms as $category ) {
					if ( taxonomy_exists( $category->taxonomy ) ) {
						$term = term_exists( $category->slug, $category->taxonomy );
						if ( $term !== 0 && $term !== null ) {
							wp_set_post_terms( $new_post_id, [ $term['term_taxonomy_id'] ], $category->taxonomy, true );
						} else {
							wp_insert_term(
								$category->name,   // the term
								$category->taxonomy, // the taxonomy
								[
									'description' => $category->description,
									'slug'        => $category->slug,
									'parent'      => $category->parent,
								]
							);

							wp_set_post_terms( $new_post_id, [ $term['term_taxonomy_id'] ], $category->taxonomy, true );
						}
					}
				}
			}

			return rest_ensure_response(
				$this->posts->transform(
					get_post( $new_post_id )
				)
			);
		}

	}

}
