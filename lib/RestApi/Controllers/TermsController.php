<?php

namespace FL\Assistant\RestApi\Controllers;

use FL\Assistant\Pagination\TermsPaginator;
use \WP_REST_Server;

/**
 * REST API logic for terms.
 */
class TermsController extends AssistantController {

	/**
	 * Register routes.
	 */
	public function register_routes() {
		$this->route(
			'/terms', [
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'terms' ],
					'permission_callback' => function () {
						return current_user_can( 'edit_published_posts' );
					},
				],
			]
		);

		$this->route(
			'/terms/hierarchical', [
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'hierarchical_terms' ],
					'permission_callback' => function () {
						return current_user_can( 'edit_published_posts' );
					},
				],
			]
		);

		$this->route(
			'/terms/count', [
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'terms_count' ],
					'permission_callback' => function () {
						return current_user_can( 'moderate_comments' );
					},
				],
			]
		);

		$this->route(
			'/terms/(?P<id>\d+)', [
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'term' ],
					'args'                => [
						'id' => [
							'required' => true,
							'type'     => 'number',
						],
					],
					'permission_callback' => function () {
						return current_user_can( 'edit_published_posts' );
					},
				],
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'update_term' ],
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
						return current_user_can( 'edit_published_posts' );
					},
				],
			]
		);

		$this->route(
			'/terms', [
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'create_term' ],
					'permission_callback' => function () {
						return current_user_can( 'edit_published_posts' );
					},
				],
			]
		);
	}

	/**
	 * Returns an array of response data for a single term.
	 */
	public function get_term_response_data( $term ) {
		$response = [
			'description'    => $term->description,
			'editUrl'        => get_edit_term_link( $term->term_id, $term->taxonomy ),
			'id'             => $term->term_id,
			'isHierarchical' => is_taxonomy_hierarchical( $term->taxonomy ),
			'parent'         => $term->parent,
			'slug'           => $term->slug,
			'taxonomy'       => $term->taxonomy,
			'title'          => $term->name,
			'url'            => get_term_link( $term ),
		];

		return $response;
	}

	/**
	 * Returns an array of terms and related data.
	 */
	public function terms( $request ) {
		$params    = $request->get_params();
		$paginator = new TermsPaginator();

		$pager = $paginator->query(
			$params, function ( $term ) {
				return $this->get_term_response_data( $term );
			}
		);

		return rest_ensure_response( $pager->to_array() );
	}

	/**
	 * Returns an array of terms and related data
	 * with child terms contained in the parent
	 * term's data array.
	 */
	public function hierarchical_terms( $request ) {
		$response = [];
		$children = [];
		$params   = $request->get_params();
		$terms    = get_terms( $params );

		foreach ( $terms as $term ) {
			if ( $term->parent ) {
				if ( ! isset( $children[ $term->parent ] ) ) {
					$children[ $term->parent ] = [];
				}
				$children[ $term->parent ][] = $term;
			}
		}

		foreach ( $terms as $term ) {
			if ( ! $term->parent ) {
				$parent             = $this->get_term_response_data( $term );
				$parent['children'] = $this->get_child_terms( $term, $children );
				$response[]         = $parent;
			}
		}

		return rest_ensure_response( $response );
	}

	/**
	 * Returns an array of child terms for the given term.
	 * A $children array must be passed to search for children.
	 */
	public function get_child_terms( $term, $children ) {
		if ( isset( $children[ $term->term_id ] ) ) {
			$term_children = $children[ $term->term_id ];
			foreach ( $term_children as $i => $child ) {
				$term_children[ $i ]             = $this->get_term_response_data( $child );
				$term_children[ $i ]['children'] = $this->get_child_terms( $child, $children );
			}

			return $term_children;
		}

		return [];
	}

	/**
	 * Returns an array of counts by taxonomy type.
	 */
	public function terms_count( $request ) {

		$taxonomies = $this->container()->service( 'posts' )->get_taxononies();
		$response   = [];

		foreach ( $taxonomies as $slug => $label ) {
			$count             = wp_count_terms( $slug );
			$response[ $slug ] = (int) $count;
		}

		return rest_ensure_response( $response );
	}

	/**
	 * Returns data for a single term.
	 */
	public function term( $request ) {
		$id       = $request->get_param( 'id' );
		$term     = get_term( $id );
		$response = $this->get_term_response_data( $term );

		return rest_ensure_response( $response );
	}

	/**
	 * Creates a single term.
	 */
	public function create_term( $request ) {
		$data = array_map( 'sanitize_text_field', $request->get_params() );
		$id   = wp_insert_term(
			$data['name'],
			$data['taxonomy'],
			[
				'description' => $data['description'],
				'slug'        => $data['slug'],
				'parent'      => $data['parent'],
			]
		);

		if ( is_wp_error( $id ) ) {
			if ( isset( $id->errors['term_exists'] ) ) {
				return [
					'error' => 'exists',
				];
			}

			return [
				'error' => true,
			];
		}

		return $this->get_term_response_data( get_term( $id['term_id'], $data['taxonomy'] ) );
	}

	/**
	 * Updates a single term based on the specified action.
	 */
	public function update_term( $request ) {
		$id     = $request->get_param( 'id' );
		$action = $request->get_param( 'action' );
		$term   = get_term( $id );

		if ( ! current_user_can( 'edit_term', $id ) ) {
			return rest_ensure_response(
				[
					'error' => true,
				]
			);
		}

		switch ( $action ) {
			case 'data':
				$data = (array) $request->get_param( 'data' );
				wp_update_term( $id, $term->taxonomy, $data );
				break;
			case 'trash':
				wp_delete_term( $id, $term->taxonomy );
				break;
		}

		return rest_ensure_response(
			[
				'success' => true,
			]
		);
	}
}
