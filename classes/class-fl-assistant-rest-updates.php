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

		register_rest_route(
			FL_Assistant_REST::$namespace, '/updates/update-plugin', array(
				array(
					'methods'  => WP_REST_Server::READABLE,
					'callback' => __CLASS__ . '::update_plugin',
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

		if ( current_user_can( 'update_plugins' ) ) {
			$update_plugins = get_site_transient( 'update_plugins' );
			if ( ! empty( $update_plugins->response ) ) {
				$plugins = array(
					'label' => __( 'Plugins', 'fl-assistant' ),
					'items' => [],
				);
				foreach ( $update_plugins->response as $key => $update ) {
					$plugin     	    = get_plugin_data( trailingslashit( WP_PLUGIN_DIR ) . $key );
					$plugins['items'][] = self::get_plugin_response_data( $update, $plugin );
				}
				$response[] = $plugins;
			}
		}

		if ( current_user_can( 'update_themes' ) ) {
			$update_themes = get_site_transient( 'update_themes' );
			if ( ! empty( $update_themes->response ) ) {
				$themes = array(
					'label' => __( 'Themes', 'fl-assistant' ),
					'items' => [],
				);
				foreach ( $update_themes->response as $key => $update ) {
					$theme      	   = wp_get_theme( $key );
					$themes['items'][] = self::get_theme_response_data( $update, $theme );
				}
				$response[] = $themes;
			}
		}

		return rest_ensure_response( $response );
	}

	/**
	 * Updates a single plugin.
	 *
	 * @since  0.1
	 * @param object $request
	 * @return array
	 */
	static public function update_plugin( $request ) {
		if ( ! current_user_can( 'update_plugins' ) ) {
			die();
		}

		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
		require_once ABSPATH . 'wp-admin/includes/class-plugin-upgrader.php';
		require_once FL_ASSISTANT_DIR . 'classes/class-fl-assistant-upgrader.php';

		$plugin = $request->get_param( 'plugin' );

		$upgrader = new Plugin_Upgrader( new FL_Assistant_Upgrader( array(
			'title'  => __( 'Update Plugin', 'fl-assistant' ),
			'nonce'  => 'upgrade-plugin_' . $plugin,
			'url' 	 => 'update.php?action=upgrade-plugin&plugin=' . urlencode( $plugin ),
			'plugin' => $plugin,
		) ) );

		$upgrader->upgrade( $plugin );
	}
}

FL_Assistant_REST_Updates::register_routes();
