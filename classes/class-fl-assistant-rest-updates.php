<?php

/**
 * REST API logic for updates.
 *
 * @since 0.1
 */
final class FL_Assistant_REST_Updates {

	/**
	 * Register routes.
	 *
	 * @since  0.1
	 * @return void
	 */
	static public function register_routes() {
		register_rest_route(
			FL_Assistant_REST::$namespace, '/updates', array(
				array(
					'methods'  => WP_REST_Server::READABLE,
					'callback' => __CLASS__ . '::updates',
				),
			)
		);
	}

	/**
	 * Returns an array of response data for a single update.
	 *
	 * @since  0.1
	 * @param object $update
	 * @return array
	 */
	static public function get_update_response_data( $update ) {
		return array(
			'title' => $update['Name'],
		);
	}

	/**
	 * Returns an array of updates and related data.
	 *
	 * @since  0.1
	 * @param object $request
	 * @return array
	 */
	static public function updates( $request ) {
		$response = array();

		if ( $plugins = current_user_can( 'update_plugins' ) ) {
                $update_plugins = get_site_transient( 'update_plugins' );
                if ( ! empty( $update_plugins->response ) ) {
					foreach ( $update_plugins->response as $key => $plugin ) {
						$plugin_data = get_plugin_data( trailingslashit( WP_PLUGIN_DIR ) . $key );
						$response[] = self::get_update_response_data( $plugin_data );
					}
				}
        }

        // if ( $themes = current_user_can( 'update_themes' ) ) {
        //         $update_themes = get_site_transient( 'update_themes' );
        //         if ( ! empty( $update_themes->response ) ) {
		// 			$data['themes'] = $update_themes->response;
		// 		}
        // }

		return rest_ensure_response( $response );
	}
}

FL_Assistant_REST_Updates::register_routes();
