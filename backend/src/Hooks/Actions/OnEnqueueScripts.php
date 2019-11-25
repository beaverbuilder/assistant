<?php

namespace FL\Assistant\Hooks\Actions;

use FL\Assistant\Data\Repository\PostsRepository;
use FL\Assistant\Data\Repository\UsersRepository;
use FL\Assistant\Data\Site;
use FL\Assistant\Data\Transformers\UserTransformer;
use FL\Assistant\Data\UserState;
use FLBuilderModel;
use WP_REST_Request;

/**
 * Class OnEnqueueScripts
 * @package FL\Assistant\Hooks\Actions
 *
 */
class OnEnqueueScripts {

	/**
	 * @var UsersRepository
	 */
	protected $users;
	/**
	 * @var PostsRepository
	 */
	protected $posts;

	/**
	 * @var Site
	 */
	protected $site;

	/**
	 * @var UserTransformer
	 */
	protected $user_transform;


	/**
	 * OnEnqueueScripts constructor.
	 *
	 * @param UsersRepository $users
	 * @param PostsRepository $posts
	 * @param Site $site
	 * @param UserTransformer $user_transform
	 */
	public function __construct(
		UsersRepository $users,
		PostsRepository $posts,
		Site $site,
		UserTransformer $user_transform
	) {

		$this->users          = $users;
		$this->posts          = $posts;
		$this->site           = $site;
		$this->user_transform = $user_transform;
	}


	/**
	 * @return array
	 * @throws \Exception
	 */
	public function generate_initial_state() {
		if ( ! is_user_logged_in() ) {
			return [];
		}

		$user_state = UserState::get();

		// Always show in admin bar and hidden in wp-admin.
		if ( is_admin() ) {
			$user_state['window']['isHidden'] = true;
			$user_state['window']['hiddenAppearance'] = 'admin_bar';
		}

		return [
			'appOrder'           => $user_state['appOrder'],
			'counts'             => $this->get_counts(),
			'shouldReduceMotion' => false, /* Disabled */

			/* New UI Props */
			'appearance'         => $user_state['appearance'],
			'history'            => $user_state['history'],
			'searchHistory'      => $user_state['searchHistory'],
			'shouldShowLabels'   => false, /* Disabled */
			'window'             => $user_state['window'],
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

		$current_user = $this->users->current( $this->user_transform );

		return [
			'adminURLs'         => $this->site->get_admin_urls(),
			'ajaxUrl'           => admin_url( 'admin-ajax.php' ),
			'apiRoot'           => esc_url_raw( get_rest_url() ),
			'cloudUrl'          => FL_ASSISTANT_CLOUD_URL,
			'contentTypes'      => $this->posts->get_types(),
			'contentStatus'     => $this->posts->get_stati(),
			'currentPageView'   => $this->site->get_current_view(),
			'currentUser'       => $current_user,
			'defaultAppName'    => 'fl-dashboard',
			'emptyTrashDays'    => EMPTY_TRASH_DAYS,
			'isShowingAdminBar' => is_admin_bar_showing(),
			'isAdmin'           => is_admin(),
			'nonce'             => [
				'api'             => wp_create_nonce( 'wp_rest' ),
				'reply'           => wp_create_nonce( 'replyto-comment' ),
				'replyUnfiltered' => wp_create_nonce( 'unfiltered-html-comment' ),
				'updates'         => wp_create_nonce( 'updates' ),
			],
			'pluginURL'         => FL_ASSISTANT_URL,
			'taxonomies'        => $this->posts->get_taxononies(),
			'userRoles'         => $this->users->get_roles(),
		];
	}

	/**
	 * Returns an array of all counts to hydrate the store.
	 */
	public function get_counts() {
		$request  = new WP_REST_Request( 'GET', '/fl-assistant/v1/counts' );
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

		// Don't show in admin iframes.
		if ( defined( 'IFRAME_REQUEST' ) && IFRAME_REQUEST ) {
			return false;
		}

		// User is logged in, and the current request is not customizer or an iframe
		$state = UserState::get();

		// Don't show Assistant in the WP Admin if the user has turned it off.
		if ( is_admin() && ! $state['shouldShowInAdmin'] ) {
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

		wp_register_script( 'fl-fluid', $url . 'build/fl-assistant-fluid.bundle.js', [ 'react', 'react-dom' ], $ver, false );
		wp_register_style( 'fl-fluid', $url . 'build/fl-assistant-fluid.bundle.css', [], $ver, null );

		if ( $this->should_enqueue() ) {

			$config = $this->generate_frontend_config();
			$state  = $this->generate_initial_state();

			// API - loaded in header
			$js_deps = [
				'fl-fluid',
				'lodash',
				'heartbeat',
				'wp-i18n',
				'wp-keycodes',
				'wp-dom-ready',
			];

			wp_enqueue_style( 'fl-assistant-system', $url . 'build/fl-assistant-system.bundle.css', [ 'fl-fluid' ], $ver, null );
			wp_enqueue_script( 'fl-assistant-system', $url . 'build/fl-assistant-system.bundle.js', $js_deps, $ver, false );

			wp_localize_script( 'fl-assistant-system', 'FL_ASSISTANT_CONFIG', $config );
			wp_localize_script( 'fl-assistant-system', 'FL_ASSISTANT_INITIAL_STATE', $state );

			// Apps - loaded in header
			wp_enqueue_style( 'fl-assistant-apps', $url . 'build/fl-assistant-apps.bundle.css', [], $ver, null );
			wp_enqueue_script( 'fl-assistant-apps', $url . 'build/fl-assistant-apps.bundle.js', $js_deps, $ver, false );

			// UI Render - loaded in footer
			wp_enqueue_style( 'fl-assistant-render', $url . 'build/fl-assistant-render.bundle.css', [], $ver, null );
			wp_enqueue_script( 'fl-assistant-render', $url . 'build/fl-assistant-render.bundle.js', $js_deps, $ver, true );

			do_action( 'fl_assistant_enqueue' );
		}
	}

	public function __invoke() {
		$this->enqueue();
	}
}
