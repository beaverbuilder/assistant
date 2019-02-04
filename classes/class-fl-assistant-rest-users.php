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
					'permission_callback' => function() {
						return current_user_can( 'list_users' );
					}
				),
			)
		);

		register_rest_route(
			FL_Assistant_REST::$namespace, '/user/(?P<id>\d+)', array(
				array(
					'methods'  => WP_REST_Server::READABLE,
					'callback' => __CLASS__ . '::user',
					'permission_callback' => function() {
						return current_user_can( 'list_users' );
					}
				),
			)
		);

		register_rest_route(
			FL_Assistant_REST::$namespace, '/current-user/state', array(
				array(
					'methods'  => WP_REST_Server::CREATABLE,
					'callback' => __CLASS__ . '::update_user_state',
					'permission_callback' => function() {
						return !! wp_get_current_user()->ID;
					}
				),
			)
		);
	}

	/**
	 * Returns an array of response data for a single user.
	 *
	 * @since  0.1
	 * @param object $user
	 * @return array
	 */
	static public function get_user_response_data( $user ) {
		return array(
			'date'      => $user->user_registered,
			'edit_url'  => get_edit_user_link( $user->ID, '' ),
			'thumbnail' => get_avatar_url( $user->ID ),
			'title'     => $user->display_name,
			'url'       => get_author_posts_url( $user->ID ),
		);
	}

	/**
	 * Returns an array of users and related data.
	 *
	 * @since  0.1
	 * @param object $request
	 * @return array
	 */
	static public function users( $request ) {
		$response = array();
		$params   = $request->get_params();
		$users    = get_users( $params );

		foreach ( $users as $user ) {
			$response[] = self::get_user_response_data( $user );
		}

		return rest_ensure_response( $response );
	}

	/**
	 * Returns data for a single user.
	 *
	 * @since  0.1
	 * @param object $request
	 * @return array
	 */
	static public function user( $request ) {
		$id       = $request->get_param( 'id' );
		$user     = get_user_by( 'id', $id );
		$response = self::get_user_response_data( $user );

		return rest_ensure_response( $response );
	}

	/**
	 * Updates the saved state for a user.
	 *
	 * @since  0.1
	 * @param object $request
	 * @return void
	 */
	static public function update_user_state( $request ) {
		$id    = wp_get_current_user()->ID;
		$state = json_decode( $request->get_param( 'state' ) );

		FL_Assistant_Data::update_user_state( $id, $state );
	}
}

FL_Assistant_REST_Users::register_routes();
