<?php

/**
 * REST API logic for users.
 *
 * @since 0.1
 */
final class FL_Assistant_REST_Users {

	/**
	 * Register routes.
	 *
	 * @since  0.1
	 * @return void
	 */
	static public function register_routes() {
		register_rest_route(
			FL_Assistant_REST::$namespace, '/users', array(
				array(
					'methods'  => WP_REST_Server::READABLE,
					'callback' => __CLASS__ . '::users',
				),
			)
		);
	}

	/**
	 * Returns an array of posts and related data.
	 *
	 * @since  0.1
	 * @param object $request
	 * @return array
	 */
	static public function users( $request ) {
		$response = array();
        $user_id = $request->get_param( 'id' );

        $response['test'] = 'Hey dog';

		return rest_ensure_response( $response );
	}
}

FL_Assistant_REST_Users::register_routes();
