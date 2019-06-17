<?php
namespace FL\Assistant\Rest;

use FL\Assistant\Rest\Traits\HasAssistantNamespace;
use \WP_REST_Server;
use \WP_REST_Request;
use \WP_REST_Response;
/**
 * REST API logic for updates.
 */
class UpdatesController {

	use HasAssistantNamespace;

	/**
	 * Register routes.
	 */
	static public function register_routes() {
		static::route('/updates', array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => __CLASS__ . '::updates',
					'args'                => array(
						'type' => array(
							'required' => false,
							'type'     => 'string',
						),
					),
					'permission_callback' => function() {
						return current_user_can( 'update_plugins' ) && current_user_can( 'update_themes' );
					},
				),
			)
		);

		static::route('/updates/count', array(
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
	 */
	static public function get_plugin_response_data( $update, $plugin ) {
		$thumbnail = null;
		$banner = null;

		if ( isset( $update->icons ) ) {
			if ( isset( $update->icons['2x'] ) ) {
				$thumbnail = $update->icons['2x'];
			} elseif ( isset( $update->icons['1x'] ) ) {
				$thumbnail = $update->icons['1x'];
			}
		}

		if ( isset( $update->banners ) ) {
			if ( isset( $update->banners['2x'] ) ) {
				$banner = $update->banners['2x'];
			} elseif ( isset( $update->banners['1x'] ) ) {
				$banner = $update->banners['1x'];
			}
		}

		return array(
			'author'      => $plugin['AuthorName'],
			'banner'      => $banner,
			'content'     => $plugin['Description'],
			'key'         => $update->plugin,
			'meta'        => $plugin['Version'] . ' by ' . $plugin['AuthorName'],
			'metaUpdated' => $update->new_version . ' by ' . $plugin['AuthorName'],
			'plugin'      => $update->plugin,
			'thumbnail'   => $thumbnail,
			'title'       => $plugin['Name'],
			'type'        => 'plugin',
			'version'     => $plugin['Version'],
		);
	}

	/**
	 * Returns an array of response data for a single theme.
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
			'banner'       => $theme->get_screenshot(),
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
	 */
	static public function updates( $request ) {
		require_once ABSPATH . 'wp-admin/includes/plugin.php';

		wp_update_plugins();
		wp_update_themes();

		$response       = array();
		$update_plugins = get_site_transient( 'update_plugins' );
		$update_themes  = get_site_transient( 'update_themes' );
		$type           = $request->get_param( 'type' );

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
	 */
	static public function updates_count( $request ) {
		wp_update_plugins();
		wp_update_themes();

		$count          = 0;
		$plugins        = 0;
		$themes         = 0;
		$update_plugins = get_site_transient( 'update_plugins' );
		$update_themes  = get_site_transient( 'update_themes' );

		if ( current_user_can( 'update_plugins' ) && ! empty( $update_plugins->response ) ) {
			$plugins = count( $update_plugins->response );
			$count += $plugins;
		}

		if ( current_user_can( 'update_themes' ) && ! empty( $update_themes->response ) ) {
			$themes = count( $update_themes->response );
			$count += $themes;
		}

		return rest_ensure_response(
			array(
				'plugins' => $plugins,
				'themes'  => $themes,
				'total'   => $count,
			)
		);
	}
}

UpdatesController::register_routes();
