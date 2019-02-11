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
	 * Returns the notifcation count for the current user.
	 *
	 * @param object $request
	 * @return array
	 */
	static public function count( $request ) {
		return array( 'count' => 10 );
	}
}

FL_Assistant_REST_Notifications::register_routes();
