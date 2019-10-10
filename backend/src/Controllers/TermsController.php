<?php

namespace FL\Assistant\Controllers;

use FL\Assistant\Data\Transformers\TermsTransformer;
use FL\Assistant\Data\Repository\PostsRepository;
use FL\Assistant\Data\Repository\TermsRepository;
use FL\Assistant\System\Contracts\ControllerAbstract;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * REST API logic for terms.
 */
class TermsController extends ControllerAbstract {

	protected $terms;
	protected $posts;
	protected $transformer;

	public function __construct( TermsRepository $terms, PostsRepository $posts, TermsTransformer $transformer ) {
		$this->terms = $terms;
		$this->posts = $posts;
		$this->transformer = $transformer;
	}
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
	 * Returns an array of terms and related data.
	 * @param WP_REST_Request $request
	 * @return mixed|WP_REST_Response
	 */
	public function terms( WP_REST_Request $request ) {

		return $this->terms->paginate( $request->get_params() )
			->apply_transform( $this->transformer )
			->to_rest_response();
	}

	/**
	 * Returns an array of terms and related data
	 * with child terms contained in the parent
	 * term's data array.
	 * @param WP_REST_Request $request
	 * @return mixed|WP_REST_Response
	 */
	public function hierarchical_terms( WP_REST_Request $request ) {
		$response = [];
		$children = [];
		$params   = $request->get_params();
		$terms    = $this->terms->find_where( $params );

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
				$term->children = $this->terms->get_child_terms( $term, $children, $this->transformer );
				$response[] 	= $term;
			}
		}

		return rest_ensure_response( array_map( $this->transformer, $response ) );
	}


	/**
	 * Returns an array of counts by taxonomy type.
	 * @return mixed|WP_REST_Response
	 */
	public function terms_count() {

		$taxonomies = $this->posts->get_taxononies();
		$response   = [];

		foreach ( $taxonomies as $slug => $label ) {
			$count             = wp_count_terms( $slug );
			$response[ $slug ] = (int) $count;
		}

		return rest_ensure_response( $response );
	}

	/**
	 * Returns data for a single term.
	 * @param WP_REST_Request $request
	 * @return mixed|WP_REST_Response
	 */
	public function term( WP_REST_Request $request ) {
		$id       = $request->get_param( 'id' );
		$term     = $this->terms->find( $id, $this->transformer );
		return rest_ensure_response( $term );
	}

	/**
	 * Creates a single term.
	 * @param WP_REST_Request $request
	 * @return array|mixed|WP_REST_Response
	 */
	public function create_term( WP_REST_Request $request ) {
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

		$term = call_user_func( $this->transformer, get_term( $id['term_id'], $data['taxonomy'] ) );
		return rest_ensure_response( $term );
	}

	/**
	 * Updates a single term based on the specified action.
	 * @param WP_REST_Request $request
	 * @return mixed|WP_REST_Response
	 */
	public function update_term( WP_REST_Request $request ) {
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
