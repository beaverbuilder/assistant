<?php

/**
 * REST API logic for notifications.
 */
final class FL_Assistant_REST_Notifications {

	/**
	 * Register routes.
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
	 */
	static public function count( $request ) {
		$result = array(
			'total' => 0,
		);

		// Comments count
		$request = new WP_REST_Request( 'GET', '/fl-assistant/v1/comments/count' );
		$response = rest_do_request( $request );
		$data = $response->get_data();
		$result['comments'] = isset( $data['total'] ) ? $data['total'] : 0;
		$result['total'] += isset( $data['total'] ) ? $data['total'] : 0;

		// Updates count
		$request = new WP_REST_Request( 'GET', '/fl-assistant/v1/updates/count' );
		$response = rest_do_request( $request );
		$data = $response->get_data();
		$result['updates'] = isset( $data['total'] ) ? $data['total'] : 0;
		$result['total'] += isset( $data['total'] ) ? $data['total'] : 0;

		return $result;
	}
}

FL_Assistant_REST_Notifications::register_routes();
