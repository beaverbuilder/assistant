<?php

namespace FL\Assistant\Actions;

use FL\Assistant\Util\HasContainer;

/**
 * Class OnEnqueueScripts
 * @package FL\Assistant\Actions
 *
 */
class OnEnqueueScripts {

	use HasContainer;

	/**
	 * @return array
	 * @throws \Exception
	 */
	public function generate_initial_state() {

		$users      = $this->container()->service( 'users' );
		$user_state = $users->current()->get_state();

		return [
			'appOrder'           => $user_state['appOrder'],
			'counts'             => $this->get_counts(),
			'shouldReduceMotion' => $user_state['shouldReduceMotion'],

			/* New UI Props */
			'window'             => $user_state['window'],
			'appearance'         => $user_state['appearance'],
			'shouldShowLabels'   => $user_state['shouldShowLabels'],
			'history'            => $user_state['history'],
		];
	}

	/**
	 *
	 * Compiles an array of all assistant data.
	 *
	 * NOTE: Kept in alphabetical order.
	 *
	 * @return array
	 * @throws \Exception
	 */
	public function generate_frontend_config() {

		$container    = $this->container();
		$user_data    = $container->service( 'users' );
		$post_data    = $container->service( 'posts' );
		$site_data    = $container->service( 'site' );
		$current_user = $user_data->current();

		return [
			'ajaxUrl'         => admin_url( 'admin-ajax.php' ),
			'apiRoot'         => esc_url_raw( get_rest_url() ),
			'cloudUrl'        => FL_ASSISTANT_CLOUD_URL,
			'contentTypes'    => $post_data->get_types(),
			'contentStatus'   => $post_data->get_stati(),
			'currentPageView' => $site_data->get_current_view(),
			'currentUser'     => $current_user->to_array(),
			'adminURLs'       => $site_data->get_admin_urls(),
			'defaultAppName'  => 'fl-dashboard',
			'nonce'           => [
				'api'             => wp_create_nonce( 'wp_rest' ),
				'reply'           => wp_create_nonce( 'replyto-comment' ),
				'replyUnfiltered' => wp_create_nonce( 'unfiltered-html-comment' ),
				'updates'         => wp_create_nonce( 'updates' ),
			],
			'pluginURL'       => FL_ASSISTANT_URL,
			'taxonomies'      => $post_data->get_taxononies(),
			'userRoles'       => $user_data->get_roles(),
		];
	}

	/**
	 * Returns an array of all counts to hydrate the store.
	 */
	public function get_counts() {
		$request  = new \WP_REST_Request( 'GET', '/fl-assistant/v1/counts' );
		$response = rest_do_request( $request );

		return $response->get_data();
	}

	/**
	 * Check if the frontend scripts/styles should be enqueued
	 */
	public function should_enqueue() {

		// Users must be logged in.
		if ( ! is_user_logged_in() ) {
			return false;
		}

		// Don't show Assistant in customizer.
		if ( is_customize_preview() ) {
			return false;
		}

		// There is no read-only assistant (for now). Users must be able to edit.
		if ( ! current_user_can( 'edit_published_posts' ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Enqueue all scripts and styles
	 */
	public function enqueue() {

		$url = FL_ASSISTANT_URL;
		$ver = FL_ASSISTANT_VERSION;

		wp_register_script( 'fl-vendors', $url . 'build/fl-assistant-vendors.bundle.js', false, $ver, false );

		if ( $this->should_enqueue() ) {

			$config = $this->generate_frontend_config();
			$state  = $this->generate_initial_state();

			// API - loaded in header
			$js_deps = [ 'heartbeat', 'wp-i18n', 'fl-vendors' ];

			wp_enqueue_style( 'fl-assistant', $url . 'build/fl-assistant-api.bundle.css', [], $ver, null );
			wp_enqueue_script( 'fl-assistant', $url . 'build/fl-assistant-api.bundle.js', $js_deps, $ver, false );

			wp_localize_script( 'fl-assistant', 'FL_ASSISTANT_CONFIG', $config );
			wp_localize_script( 'fl-assistant', 'FL_ASSISTANT_INITIAL_STATE', $state );

			// Apps - loaded in header
			wp_enqueue_style( 'fl-assistant-apps', $url . 'build/fl-assistant-apps.bundle.css', [], $ver, null );
			wp_enqueue_script( 'fl-assistant-apps', $url . 'build/fl-assistant-apps.bundle.js', $js_deps, $ver, false );

			// UI - loaded in footer
			wp_enqueue_style( 'fl-assistant-ui', $url . 'build/fl-assistant-ui.bundle.css', [], $ver, null );
			wp_enqueue_script( 'fl-assistant-ui', $url . 'build/fl-assistant-ui.bundle.js', $js_deps, $ver, true );
		}
	}

	public function __invoke() {
		$this->enqueue();
	}
}
