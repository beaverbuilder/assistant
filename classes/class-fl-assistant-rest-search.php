<?php

/**
 * Handles retrieving search results via the REST API.
 * Results are obtained by calling REST routes registered
 * in an Assistant app's config.
 */
class FL_Assistant_REST_Search {

	/**
	 * Register routes.
	 */
	static public function register_routes() {
		register_rest_route(
			FL_Assistant_REST::$namespace, '/search', array(
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => __CLASS__ . '::results',
					'permission_callback' => function() {
						return is_user_logged_in();
					},
				),
			)
		);
	}

	/**
	 * Returns search results for the endpoints sent
	 * in the current request.
	 */
	static public function results( $request ) {
		$response  = array();
		$routes = $request->get_param( 'routes' );
		$requests = array_reduce( $routes, 'rest_preload_api_request', array() );
		foreach ( $requests as $route => $request ) {
			$response[] = $request['body'];
		}
		return $response;
	}
}

FL_Assistant_REST_Search::register_routes();
