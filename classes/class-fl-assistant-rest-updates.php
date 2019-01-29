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
	 * Returns an array of response data for a single plugin.
	 *
	 * @since  0.1
	 * @param object $update
	 * @param array $plugin
	 * @return array
	 */
	static public function get_plugin_response_data( $update, $plugin ) {
		$thumbnail = null;

		if ( isset( $update->icons ) ) {
			if ( isset( $update->icons['2x'] ) ) {
				$thumbnail = $update->icons['2x'];
			} elseif ( isset( $update->icons['1x'] ) ) {
				$thumbnail = $update->icons['1x'];
			}
		}

		return array(
			'author'    => $plugin['AuthorName'],
			'thumbnail' => $thumbnail,
			'title'     => $plugin['Name'],
		);
	}

	/**
	 * Returns an array of response data for a single theme.
	 *
	 * @since  0.1
	 * @param object $update
	 * @param object $theme
	 * @return array
	 */
	static public function get_theme_response_data( $update, $theme ) {
		$thumbnail = null;

		if ( isset( $update->icons ) ) {
			if ( isset( $update->icons['2x'] ) ) {
				$thumbnail = $update->icons['2x'];
			} elseif ( isset( $update->icons['1x'] ) ) {
				$thumbnail = $update->icons['1x'];
			}
		}

		return array(
			'author'    => strip_tags( $theme->Author ),
			'thumbnail' => $theme->get_screenshot(),
			'title'     => $theme->Name,
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
		$plugins  = current_user_can( 'update_plugins' );
		$themes   = current_user_can( 'update_themes' );

		if ( $plugins ) {
			$update_plugins = get_site_transient( 'update_plugins' );
			if ( ! empty( $update_plugins->response ) ) {
				foreach ( $update_plugins->response as $key => $update ) {
					$plugin     = get_plugin_data( trailingslashit( WP_PLUGIN_DIR ) . $key );
					$response[] = self::get_plugin_response_data( $update, $plugin );
				}
			}
		}

		if ( $themes ) {
			$update_themes = get_site_transient( 'update_themes' );
			if ( ! empty( $update_themes->response ) ) {
				foreach ( $update_themes->response as $key => $update ) {
					$theme      = wp_get_theme( $key );
					$response[] = self::get_theme_response_data( $update, $theme );
				}
			}
		}

		return rest_ensure_response( $response );
	}
}

FL_Assistant_REST_Updates::register_routes();
