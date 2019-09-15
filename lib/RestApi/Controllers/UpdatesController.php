<?php
namespace FL\Assistant\RestApi\Controllers;

use FL\Assistant\Pagination\UpdatesPaginator;
use \WP_REST_Server;
use \WP_REST_Request;
use \WP_REST_Response;
/**
 * REST API logic for updates.
 */
class UpdatesController extends AssistantController {

	/**
	 * Register routes.
	 */
	public function register_routes() {
		$this->route(
			'/updates', [
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'updates' ],
					'args'                => [
						'type' => [
							'required' => false,
							'type'     => 'string',
						],
					],
					'permission_callback' => function () {
						return current_user_can( 'update_plugins' ) && current_user_can( 'update_themes' );
					},
				],
			]
		);

		$this->route(
			'/updates/count', [
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'updates_count' ],
					'permission_callback' => function() {
						return current_user_can( 'update_plugins' ) && current_user_can( 'update_themes' );
					},
				],
			]
		);
	}

	/**
	 * Returns an array of response data for a single plugin.
	 */
	public function get_plugin_response_data( $update, $plugin ) {
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

		return [
			'author'      => $plugin['AuthorName'],
			'banner'      => $banner,
			'content'     => $plugin['Description'],
			'id'          => $update->plugin,
			'meta'        => $plugin['Version'] . ' by ' . $plugin['AuthorName'],
			'metaUpdated' => $update->new_version . ' by ' . $plugin['AuthorName'],
			'plugin'      => $update->plugin,
			'thumbnail'   => $thumbnail,
			'title'       => $plugin['Name'],
			'type'        => 'plugin',
			'version'     => $plugin['Version'],
		];
	}

	/**
	 * Returns an array of response data for a single theme.
	 */
	public function get_theme_response_data( $update, $theme ) {
		$thumbnail = null;

		if ( isset( $update->icons ) ) {
			if ( isset( $update->icons['2x'] ) ) {
				$thumbnail = $update->icons['2x'];
			} elseif ( isset( $update->icons['1x'] ) ) {
				$thumbnail = $update->icons['1x'];
			}
		}

		return [
			'author'       => strip_tags( $theme->Author ),
			'banner'       => $theme->get_screenshot(),
			'content'      => $theme->Description,
			'id'           => $update['theme'],
			'meta'         => $theme->Version . ' by ' . strip_tags( $theme->Author ),
			'meta_updated' => $update['new_version'] . ' by ' . strip_tags( $theme->Author ),
			'theme'        => $update['theme'],
			'thumbnail'    => $theme->get_screenshot(),
			'title'        => $theme->Name,
			'type'         => 'theme',
			'version'      => $theme->Version,
		];
	}

	/**
	 * Returns an array of updates and related data.
	 */
	public function updates( $request ) {
		require_once ABSPATH . 'wp-admin/includes/plugin.php';

		wp_update_plugins();
		wp_update_themes();

		$response       = [];
		$update_plugins = get_site_transient( 'update_plugins' );
		$update_themes  = get_site_transient( 'update_themes' );
		$type           = $request->get_param( 'type' );

		if ( ! $type || 'all' === $type || 'plugins' === $type ) {
			//          if ( current_user_can( 'update_plugins' ) && ! empty( $update_plugins->response ) ) {

			foreach ( $update_plugins->response as $key => $update ) {
				$plugin = get_plugin_data( trailingslashit( WP_PLUGIN_DIR ) . $key );
				if ( version_compare( $update->new_version, $plugin['Version'], '>' ) ) {
					$response[] = $this->get_plugin_response_data( $update, $plugin );
				}
			}
			//          }
		}

		if ( ! $type || 'all' === $type || 'themes' === $type ) {
			//          if ( current_user_can( 'update_themes' ) && ! empty( $update_themes->response ) ) {

			foreach ( $update_themes->response as $key => $update ) {
				$theme = wp_get_theme( $key );
				if ( version_compare( $update['new_version'], $theme->Version, '>' ) ) {
					$response[] = $this->get_theme_response_data( $update, $theme );
				}
			}
			//          }
		}

		$p = new UpdatesPaginator();
		return rest_ensure_response( $p->paginate( $response )->to_array() );
	}

	/**
	 * Returns the number of updates found.
	 */
	public function updates_count( $request ) {
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
			[
				'plugins' => $plugins,
				'themes'  => $themes,
				'total'   => $count,
			]
		);
	}
}
