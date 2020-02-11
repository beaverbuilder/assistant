<?php

namespace FL\Assistant\Controllers;

require_once ABSPATH . 'wp-admin/includes/update.php';
require_once ABSPATH . 'wp-admin/includes/plugin.php';

use FL\Assistant\Data\Transformers\PluginUpdatesTransformer;
use FL\Assistant\Data\Transformers\ThemeUpdatesTransformer;

use FL\Assistant\System\Contracts\ControllerAbstract;
use WP_REST_Server;

/**
 * REST API logic for updates.
 */
class UpdatesController extends ControllerAbstract {

	/**
	 * @var ThemeUpdatesTransformer
	 */
	protected $theme_updates_transformer;
	/**
	 * @var PluginUpdatesTransformer
	 */
	protected $plugin_updates_transformer;

	/**
	 * UpdatesController constructor.
	 * @param PluginUpdatesTransformer $plugin_updates_transformer
	 * @param ThemeUpdatesTransformer $theme_updates_transformer
	 */
	public function __construct( PluginUpdatesTransformer $plugin_updates_transformer, ThemeUpdatesTransformer $theme_updates_transformer ) {
		$this->plugin_updates_transformer = $plugin_updates_transformer;
		$this->theme_updates_transformer = $theme_updates_transformer;
	}

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
					'permission_callback' => function () {
						return current_user_can( 'update_plugins' ) && current_user_can( 'update_themes' );
					},
				],
			]
		);
	}

	/**
	 * Returns an array of updates and related data.
	 * @param \WP_REST_Request $request
	 * @return mixed|\WP_REST_Response
	 */
	public function updates( \WP_REST_Request $request ) {
		wp_update_plugins();
		wp_update_themes();

		$plugins = get_plugin_updates();
		$themes = get_theme_updates();
		$type = $request->get_param( 'type' );

		$response = [];

		if ( ! $type || 'all' === $type || 'plugins' === $type ) {
			foreach ( $plugins as $key => $plugin ) {
				$response[] = call_user_func( $this->plugin_updates_transformer, $plugin );
			}
		}

		if ( ! $type || 'all' === $type || 'themes' === $type ) {
			foreach ( $themes as $key => $theme ) {
				$response[] = call_user_func( $this->theme_updates_transformer, $theme );
			}
		}

		$p = $this->paginate_array( $response, count( $response ), 0 );

		return rest_ensure_response( $p->to_array() );
	}

	/**
	 * Returns the number of updates found.
	 */
	public function updates_count( $request ) {
		wp_update_plugins();
		wp_update_themes();

		$count = 0;
		$plugins = 0;
		$themes = 0;

		if ( current_user_can( 'update_plugins' ) ) {
			$plugins = count( get_plugin_updates() );
			$count += $plugins;
		}

		if ( current_user_can( 'update_themes' ) ) {
			$themes = count( get_theme_updates() );
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
