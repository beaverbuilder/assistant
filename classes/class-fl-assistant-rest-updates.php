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
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => __CLASS__ . '::updates',
					'permission_callback' => function() {
						return current_user_can( 'update_plugins' ) && current_user_can( 'update_themes' );
					},
				),
			)
		);

		register_rest_route(
			FL_Assistant_REST::$namespace, '/updates/count', array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => __CLASS__ . '::updates_count',
					'permission_callback' => function() {
						return current_user_can( 'update_plugins' ) && current_user_can( 'update_themes' );
					},
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
			'author'       => $plugin['AuthorName'],
			'content'      => $plugin['Description'],
			'key'          => $update->plugin,
			'meta'         => $plugin['Version'] . ' by ' . $plugin['AuthorName'],
			'meta_updated' => $update->new_version . ' by ' . $plugin['AuthorName'],
			'plugin'       => $update->plugin,
			'thumbnail'    => $thumbnail,
			'title'        => $plugin['Name'],
			'type'         => 'plugin',
			'version'      => $plugin['Version'],
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
			'author'       => strip_tags( $theme->Author ),
			'content'      => $theme->Description,
			'key'          => $update['theme'],
			'meta'         => $theme->Version . ' by ' . strip_tags( $theme->Author ),
			'meta_updated' => $update['new_version'] . ' by ' . strip_tags( $theme->Author ),
			'theme'        => $update['theme'],
			'thumbnail'    => $theme->get_screenshot(),
			'title'        => $theme->Name,
			'type'         => 'theme',
			'version'      => $theme->Version,
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
		$response       = array();
		$update_plugins = get_site_transient( 'update_plugins' );
		$update_themes  = get_site_transient( 'update_themes' );
		$type           = $request->get_param( 'type' );

		require_once ABSPATH . 'wp-admin/includes/plugin.php';

		if ( ! $type || 'all' === $type || 'plugins' === $type ) {
			if ( current_user_can( 'update_plugins' ) && ! empty( $update_plugins->response ) ) {
				$plugins = array(
					'label' => __( 'Plugins', 'fl-assistant' ),
					'items' => [],
				);
				foreach ( $update_plugins->response as $key => $update ) {
					$plugin = get_plugin_data( trailingslashit( WP_PLUGIN_DIR ) . $key );
					if ( version_compare( $update->new_version, $plugin['Version'], '>' ) ) {
						$plugins['items'][] = self::get_plugin_response_data( $update, $plugin );
					}
				}
				$response[] = $plugins;
			}
		}

		if ( ! $type || 'all' === $type || 'themes' === $type ) {
			if ( current_user_can( 'update_themes' ) && ! empty( $update_themes->response ) ) {
				$themes = array(
					'label' => __( 'Themes', 'fl-assistant' ),
					'items' => [],
				);
				foreach ( $update_themes->response as $key => $update ) {
					$theme = wp_get_theme( $key );
					if ( version_compare( $update['new_version'], $theme->Version, '>' ) ) {
						$themes['items'][] = self::get_theme_response_data( $update, $theme );
					}
				}
				$response[] = $themes;
			}
		}

		return rest_ensure_response( $response );
	}

	/**
	 * Returns the number of updates found.
	 *
	 * @since  0.1
	 * @param object $request
	 * @return array
	 */
	static public function updates_count( $request ) {
		$count          = 0;
		$update_plugins = get_site_transient( 'update_plugins' );
		$update_themes  = get_site_transient( 'update_themes' );

		if ( current_user_can( 'update_plugins' ) && ! empty( $update_plugins->response ) ) {
			$count += count( $update_plugins->response );
		}

		if ( current_user_can( 'update_themes' ) && ! empty( $update_themes->response ) ) {
			$count += count( $update_themes->response );
		}

		return rest_ensure_response(
			array(
				'total' => $count,
			)
		);
	}
}

FL_Assistant_REST_Updates::register_routes();
