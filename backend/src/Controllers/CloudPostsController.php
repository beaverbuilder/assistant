<?php

namespace FL\Assistant\Controllers;

use FL\Assistant\System\Contracts\ControllerAbstract;
use FL\Assistant\System\View;
use WP_REST_Server;

/**
 * REST API logic for exporting posts.
 */
class CloudPostsController extends ControllerAbstract {

	protected $view;

	public function __construct( View $view ) {
		$this->view = $view;
	}

	/**
	 * Register routes.
	 */
	public function register_routes() {
		$this->route(
			'/posts/formed_posts/(?P<id>\d+)',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_formed_post' ],
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

		$this->route(
			'/posts/import_lib_post',
			[
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'import_lib_post' ],
					'permission_callback' => function () {
						return current_user_can( 'edit_others_posts' );
					},
				],
			]
		);

		$this->route(
			'/posts/check_exist_post',
			[
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'check_exist_post' ],
					'permission_callback' => function () {
						return current_user_can( 'edit_others_posts' );
					},
				],
			]
		);

		$this->route(
			'/posts/override_lib_post',
			[
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'override_lib_post' ],
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
						'id' => [
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


	function check_exist_post( $request ) {
		$post_data = $request->get_params();
		$post_title = $post_data['data']['post_title'];

		if ( ! function_exists( 'post_exists' ) ) {
			require_once ABSPATH . 'wp-admin/includes/post.php';
		}
		$post_exist = post_exists( $post_title, '', '', $post_data['data']['post_type'] );

		if ( $post_exist === ' 0 ' ) {

			return rest_ensure_response(
				[
					'success'    => true,
					'post_exist' => false,
				]
			);
		} else {

			return rest_ensure_response(
				[
					'success'    => true,
					'post_exist' => true,
					'post_id'    => $post_exist,
				]
			);
		}

	}

	function override_lib_post( $request ) {
		$post_data = $request->get_params();

		$override_items = $post_data['data']['override_items'];
		$post_id = $post_data['data']['ID'];
		$override_post = [];
		$override_post['ID'] = $post_data['data']['existing_post_id'];
		foreach ( $override_items as $override_item ) {
			if ( $override_item === 'content' ) {
				$override_post['post_content'] = $post_data['data']['post_content'];
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

	function import_lib_post( $request ) {

		global $wpdb;
		$post_data = $request->get_params();
		$current_user = wp_get_current_user();

		$newpost_data = [
			'post_author'  => $current_user->ID,
			'post_content' => $post_data['post_content'] ? $post_data['post_content'] : '',
			'post_excerpt' => $post_data['post_excerpt'] ? $post_data['post_excerpt'] : '',
			'post_name'    => $post_data['post_name'] ? $post_data['post_name'] : '',
			'post_status'  => 'draft',
			'post_title'   => $post_data['post_title'],
			'post_type'    => $post_data['post_type'],
			'to_ping'      => $post_data['ping_status'],
			'menu_order'   => $post_data['menu_order'],
		];

		$new_post_id = wp_insert_post( $newpost_data );

		if ( is_wp_error( $new_post_id ) ) {

			return rest_ensure_response(
				[
					'error' => true,
				]
			);

		} else {

			wp_set_post_terms( $new_post_id, null, 'category' );
			$post_meta = $post_data['post_meta'];
			$post_cat  = $post_data['post_taxonomies'];

			if ( is_array( $post_meta ) && count( $post_meta ) !== 0 ) {
				foreach ( $post_meta as $key => $value ) {

					$meta_key   = $key ? $key : '';
					$meta_value = $value ? addslashes( $value ) : '';
					if ( $meta_key !== '' && $meta_value !== '' ) {

						$wpdb->query( "INSERT INTO {$wpdb->postmeta} (post_id, meta_key, meta_value) values ({$new_post_id}, '{$meta_key}', '{$meta_value}')" ); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared

					}
				}
			}

			if ( is_array( $post_cat ) && count( $post_cat ) !== 0 ) {

				foreach ( $post_cat as $category ) {

					   $term = term_exists( $category['slug'], $category['taxonomy'] );

					   wp_set_post_terms( $new_post_id, [ $term['term_taxonomy_id'] ], $category['taxonomy'], true );

				}
			}

			return rest_ensure_response(
				[
					'success' => true,
				]
			);
		}

	}


	public function get_post_feature_media( $thumbnail_id ) {
		if ( $thumbnail_id ) {
			$thumb = [];
			$thumb_id = $thumbnail_id;

			// first grab all of the info on the image... title/description/alt/etc.
			$args = [
				'post_type' => 'attachment',
				'include'   => $thumb_id,
			];
			$thumbs = get_posts( $args );
			if ( $thumbs ) {
				// now create the new array
				$thumb['id'] = $thumbs[0]->ID;
				$thumb['title'] = $thumbs[0]->post_title;
				$thumb['description'] = $thumbs[0]->post_content;
				$thumb['caption'] = $thumbs[0]->post_excerpt;
				$thumb['alt'] = get_post_meta( $thumb_id, '_wp_attachment_image_alt', true );
				$thumb['sizes'] = [
					'full' => wp_get_attachment_image_src( $thumb_id, 'full', false ),
				];
				// add the additional image sizes
				foreach ( get_intermediate_image_sizes() as $size ) {
					$thumb['sizes'][ $size ] = wp_get_attachment_image_src( $thumb_id, $size, false );
				}
				$thumb['url'] = $thumb['sizes']['full'][0];

				return $thumb;
			} else {
				return $thumb;
			}
		}
	}



	function save_to_library( $request ) {
		$id = $request->get_param( 'id' );
		$library_id = $request->get_param( 'library_id' );

		$post = get_post( $id );
		$client = new \FL\Assistant\Clients\Cloud\CloudClient;

		$media_path = get_attached_file( get_post_thumbnail_id( $post ) );
		$media = $media_path ? curl_file_create( $media_path ) : null;

		$taxonomies = get_taxonomies( '', 'names' );
		$post_taxonomies = wp_get_object_terms( $id, $taxonomies );

		$comments = get_comments( [ 'post_id' => $id ] );

		$thumbnail_id = get_post_thumbnail_id( $id );
		$thumbnail_data = $this->get_post_feature_media( $thumbnail_id );

		return $client->libraries->createItem( $library_id,
			[
				'name' => $post->post_title,
				'type' => $post->post_type,
				'data' => [
					'post' => $post,
					'meta' => get_post_meta( $id ),
					'terms' => $post_taxonomies,
					'comments' => $comments,
					'thumbnail' => $thumbnail_data,
				],
				'media' => $media,
			]
		);
	}

}
