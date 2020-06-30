<?php

namespace FL\Assistant\Controllers;

use FL\Assistant\Data\Repository\LabelsRepository;
use FL\Assistant\Data\Repository\PostsRepository;
use FL\Assistant\Data\Transformers\PostTransformer;
use FL\Assistant\System\Contracts\ControllerAbstract;

use WP_REST_Request;
use WP_REST_Server;

/**
 * REST API logic for posts.
 */
class PostsController extends ControllerAbstract {

	protected $labels;
	protected $posts;
	protected $transformer;

	public function __construct(
		LabelsRepository $labels,
		PostsRepository $posts,
		PostTransformer $transformer
	) {
		$this->labels = $labels;
		$this->posts = $posts;
		$this->transformer = $transformer;
	}

	/**
	 * Register routes.
	 */
	public function register_routes() {
		$this->route(
			'/posts',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'posts' ],
					'permission_callback' => function () {
						return current_user_can( 'edit_others_posts' );
					},
				],
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'create_post' ],
					'permission_callback' => function () {
						return current_user_can( 'edit_others_posts' );
					},
				],
			]
		);

		$this->route(
			'/posts/hierarchical',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'hierarchical_posts' ],
					'permission_callback' => function () {
						return current_user_can( 'edit_others_posts' );
					},
				],
			]
		);

		$this->route(
			'/posts/count',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'posts_count' ],
					'permission_callback' => function () {
						return current_user_can( 'edit_others_posts' );
					},
				],
			]
		);

		$this->route(
			'/posts/(?P<id>\d+)',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'post' ],
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
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'update_post' ],
					'args'                => [
						'id'     => [
							'required' => true,
							'type'     => 'number',
						],
						'action' => [
							'required' => true,
							'type'     => 'string',
						],
					],
					'permission_callback' => function () {
						return current_user_can( 'edit_others_posts' );
					},
				],
				[
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => [ $this, 'delete_post' ],
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
			'/posts/(?P<id>\d+)/clone',
			[
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'clone_post' ],
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
	 * Returns an array of posts and related data.
	 */
	public function posts( WP_REST_Request $request ) {

		$params = $request->get_params();
		$params['perm'] = 'editable';

		if ( isset( $params['label'] ) && $params['label'] ) {
			$params['post__in'] = $this->labels->get_object_ids( 'post', $params['label'] );
			if ( ! count( $params['post__in'] ) ) {
				$params['post__in'][] = -1; // post__in returns all posts if empty.
			}
		}

		$pager = $this->posts->paginate( $params, $this->transformer );

		return rest_ensure_response( $pager->to_array() );
	}

	/**
	 * Returns an array of posts and related data
	 * with child posts contained in the parent
	 * post's data array.
	 */
	public function hierarchical_posts( $request ) {
		$response = [];
		$children = [];
		$params = $request->get_params();
		$posts = get_posts(
			array_merge(
				$params,
				[
					'perm' => 'editable',
				]
			)
		);

		foreach ( $posts as $post ) {
			if ( $post->post_parent ) {
				if ( ! isset( $children[ $post->post_parent ] ) ) {
					$children[ $post->post_parent ] = [];
				}
				$children [ $post->post_parent ][] = $post;
			}
		}

		foreach ( $posts as $post ) {
			if ( ! $post->post_parent ) {
				$parent = $this->transform( $post );
				$parent['children'] = $this->get_child_posts( $post, $children );
				$response[] = $parent;
			}
		}

		return rest_ensure_response( $response );
	}

	/**
	 * Returns an array of response data for a single post.
	 */
	public function transform( $post ) {
		return call_user_func( $this->transformer, $post );
	}

	/**
	 * Returns an array of child posts for the given post.
	 * A $children array must be passed to search for children.
	 */
	public function get_child_posts( $post, $children ) {
		if ( isset( $children[ $post->ID ] ) ) {
			$post_children = $children[ $post->ID ];
			foreach ( $post_children as $i => $child ) {
				$post_children[ $i ] = $this->transform( $child );
				$post_children[ $i ]['children'] = $this->get_child_posts( $child, $children );
			}

			return $post_children;
		}

		return [];
	}

	/**
	 * Returns an array of counts by post type.
	 */
	public function posts_count( $request ) {

		$post_types = $this->posts->get_types();
		$response = [];

		foreach ( $post_types as $slug => $label ) {
			$counts = wp_count_posts( $slug );
			$counts->total = $counts->publish + $counts->draft + $counts->pending + $counts->private + $counts->future;
			$response[ $slug ] = $counts;
		}

		return rest_ensure_response( $response );
	}

	/**
	 * Returns data for a single post.
	 */
	public function post( $request ) {
		$id = $request->get_param( 'id' );

		if ( current_user_can( 'edit_post', $id ) ) {
			$post = get_post( $id );
			return $this->transform( $post );
		}

		return [];
	}

	/**
	 * Creates a single post.
	 */
	public function create_post( $request ) {
		$id = wp_insert_post( $request->get_params() );

		if ( ! $id || is_wp_error( $id ) ) {
			return [
				'error' => true,
			];
		}

		return $this->transform( get_post( $id ) );
	}

	/**
	 * Clones a single post.
	 */
	public function clone_post( $request ) {
		global $wpdb;

		$post_id = absint( $request->get_param( 'id' ) );
		$post = get_post( $post_id );
		$current_user = wp_get_current_user();
		$post_data = [
			'comment_status' => $post->comment_status,
			'ping_status'    => $post->ping_status,
			'post_author'    => $current_user->ID,
			'post_content'   => $post->post_content,
			'post_excerpt'   => $post->post_excerpt,
			'post_name'      => $post->post_name . '-copy',
			'post_parent'    => $post->post_parent,
			'post_password'  => $post->post_password,
			'post_status'    => 'draft',
			/* translators: %s: post/page title */
			'post_title'     => sprintf( _x( '%s - Copy', '%s stands for post/page title.', 'fl-assistant' ), $post->post_title ),
			'post_type'      => $post->post_type,
			'to_ping'        => $post->to_ping,
			'menu_order'     => $post->menu_order,
		];

		$new_post_id = wp_insert_post( $post_data );
		$post_meta = $wpdb->get_results( $wpdb->prepare( "SELECT meta_key, meta_value FROM {$wpdb->postmeta} WHERE post_id = %d", $post_id ) );
		$taxonomies = get_object_taxonomies( $post->post_type );

		if ( count( $post_meta ) !== 0 ) {
			foreach ( $post_meta as $meta_info ) {
				$meta_key = $meta_info->meta_key;
				$meta_value = addslashes( $meta_info->meta_value );
				$wpdb->query( "INSERT INTO {$wpdb->postmeta} (post_id, meta_key, meta_value) values ({$new_post_id}, '{$meta_key}', '{$meta_value}')" ); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			}
		}

		foreach ( $taxonomies as $taxonomy ) {
			$post_terms = wp_get_object_terms( $post_id, $taxonomy );
			for ( $i = 0; $i < count( $post_terms ); $i++ ) {
				wp_set_object_terms( $new_post_id, $post_terms[ $i ]->slug, $taxonomy, true );
			}
		}

		return $this->transform( get_post( $new_post_id ) );
	}

	/**
	 * Updates a single post based on the specified action.
	 */
	public function update_post( $request ) {
		$id = $request->get_param( 'id' );
		$action = $request->get_param( 'action' );

		if ( ! current_user_can( 'edit_post', $id ) ) {
			return rest_ensure_response(
				[
					'error' => true,
				]
			);
		}

		switch ( $action ) {
			case 'data':
				$data = (array) $request->get_param( 'data' );
				if ( isset( $data['meta'] ) ) {
					$this->update_post_meta( $id, $data['meta'] );
					unset( $data['meta'] );
				}
				if ( isset( $data['terms'] ) ) {
					$this->update_post_terms( $id, $data['terms'] );
					unset( $data['terms'] );
				}
				if ( isset( $data['thumbnail'] ) ) {
					if ( '0' === $data['thumbnail'] ) {
						delete_post_meta( $id, '_thumbnail_id' );
					} else {
						set_post_thumbnail( $id, $data['thumbnail'] );
					}

					unset( $data['thumbnail'] );
				}
				wp_update_post(
					array_merge(
						$data,
						[
							'ID' => $id,
						]
					)
				);
				break;
			case 'meta':
				$data = (array) $request->get_param( 'data' );
				$this->update_post_meta( $id, $data );
				break;
			case 'terms':
				$data = (array) $request->get_param( 'data' );
				$this->update_post_terms( $id, $data );
				break;
			case 'trash':
				if ( ! EMPTY_TRASH_DAYS ) {
					wp_delete_post( $id );
				} else {
					wp_trash_post( $id );
				}
				break;
			case 'untrash':
				wp_untrash_post( $id );
				break;

		}

		$updated_post = get_post( $id );

		return rest_ensure_response(
			[
				'success' => true,
				'post'    => $updated_post ? $this->transform( $updated_post ) : null,
			]
		);
	}

	/**
	 * Updates post meta values for a post.
	 */
	public function update_post_meta( $id, $meta ) {
		foreach ( $meta as $key => $value ) {
			update_post_meta( $id, $key, $value );
		}
	}

	/**
	 * Updates terms for a post.
	 */
	public function update_post_terms( $id, $terms ) {
		foreach ( $terms as $taxonomy => $ids ) {
			wp_set_post_terms( $id, $ids, $taxonomy, false );
		}
	}

	/**
	 * Deletes a single post based on the specified ID.
	 */
	public function delete_post( $request ) {
		$id = $request->get_param( 'id' );

		if ( ! current_user_can( 'edit_post', $id ) ) {
			return rest_ensure_response(
				[
					'error' => true,
				]
			);
		}

		wp_delete_post( $id );

		return rest_ensure_response(
			[
				'success' => true,
			]
		);
	}
}
