<?php

/**
 * REST API logic for terms.
 */
final class FL_Assistant_REST_Terms {

	/**
	 * Register routes.
	 */
	static public function register_routes() {
		register_rest_route(
			FL_Assistant_REST::$namespace, '/terms', array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => __CLASS__ . '::terms',
					'permission_callback' => function() {
						return current_user_can( 'edit_published_posts' );
					},
				),
			)
		);

		register_rest_route(
			FL_Assistant_REST::$namespace, '/terms/count', array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => __CLASS__ . '::terms_count',
					'permission_callback' => function() {
						return current_user_can( 'moderate_comments' );
					},
				),
			)
		);

		register_rest_route(
			FL_Assistant_REST::$namespace, '/term/(?P<id>\d+)', array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => __CLASS__ . '::term',
					'permission_callback' => function() {
						return current_user_can( 'edit_published_posts' );
					},
				),
			)
		);
	}

	/**
	 * Returns an array of response data for a single term.
	 */
	static public function get_term_response_data( $term ) {
		return array(
			'title' => $term->name,
			'url'   => get_term_link( $term ),
		);
	}

	/**
	 * Returns an array of terms and related data.
	 */
	static public function terms( $request ) {
		$response = array();
		$params   = $request->get_params();
		$terms    = get_terms( $params );

		foreach ( $terms as $term ) {
			$response[] = self::get_term_response_data( $term );
		}

		return rest_ensure_response( $response );
	}

	/**
	 * Returns an array of counts by taxonomy type.
	 */
	static public function terms_count( $request ) {
		$taxonomies = FL_Assistant_Data::get_taxonomies();
		$response = array();

		foreach ( $taxonomies as $slug => $label ) {
			$count = wp_count_terms( $slug );
			$response[ $slug ] = (int) $count;
		}

		return rest_ensure_response( $response );
	}

	/**
	 * Returns data for a single term.
	 */
	static public function term( $request ) {
		$id       = $request->get_param( 'id' );
		$term     = get_term( $id );
		$response = self::get_term_response_data( $term );

		return rest_ensure_response( $response );
	}
}

FL_Assistant_REST_Terms::register_routes();
