<?php

/**
 * REST API logic for terms.
 *
 * @since 0.1
 */
final class FL_Assistant_REST_Terms {

	/**
	 * Register routes.
	 *
	 * @since  0.1
	 * @return void
	 */
	static public function register_routes() {
		register_rest_route(
			FL_Assistant_REST::$namespace, '/terms', array(
				array(
					'methods'  => WP_REST_Server::READABLE,
					'callback' => __CLASS__ . '::terms',
				),
			)
		);
	}

	/**
	 * Returns an array of terms and related data.
	 *
	 * @since  0.1
	 * @param object $request
	 * @return array
	 */
	static public function terms( $request ) {
		$response = array();
		$params = $request->get_params();
		$terms = get_terms( $params );

		foreach ( $terms as $term ) {
			$response[] = array(
				'title' => $term->name,
				'url' => get_term_link( $term ),
			);
		}

		return rest_ensure_response( $response );
	}
}

FL_Assistant_REST_Terms::register_routes();
