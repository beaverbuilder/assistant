<?php

/**
 * REST API logic for notifications.
 *
 * @since 0.1
 */
final class FL_Assistant_REST_Notifications {

	/**
	 * Register routes.
	 *
	 * @since  0.1
	 * @return void
	 */
	static public function register_routes() {
		register_rest_route(
			FL_Assistant_REST::$namespace, '/notifications/count', array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => __CLASS__ . '::count',
					'permission_callback' => function() {
						return is_user_logged_in();
					},
				),
			)
		);
	}

	/**
	 * Returns the notification count for the current user.
	 *
	 * @param object $request
	 * @return array
	 */
	static public function count( $request ) {
		$result = array(
			'total' => 0,
		);

		// Pending comments count
		$request = new WP_REST_Request( 'GET', '/fl-assistant/v1/comments/count' );
		$request->set_query_params( array( 'status' => 'hold' ) );
		$response = rest_do_request( $request );
		$data = $response->get_data();
		$result['comments'] = $data['total'];
		$result['total'] += $data['total'];

		// Updates count
		$request = new WP_REST_Request( 'GET', '/fl-assistant/v1/updates/count' );
		$response = rest_do_request( $request );
		$data = $response->get_data();
		$result['updates'] = $data['total'];
		$result['total'] += $data['total'];

		return $result;
	}
}

FL_Assistant_REST_Notifications::register_routes();
