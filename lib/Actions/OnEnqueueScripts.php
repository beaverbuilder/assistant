<?php


namespace FL\Assistant\Actions;

use FL\Assistant\AssistantData;
use FL\Assistant\Services\CloudService;
use FL\Assistant\Services\PostService;
use FL\Assistant\Services\UserService;

/**
 * Class OnEnqueueScripts
 * @package FL\Assistant\Actions
 */
class OnEnqueueScripts {

	/**
	 * @var array
	 */
	protected $config = [];

	/**
	 * @var array
	 */
	protected $state = [];

	/**
	 * @var PostService
	 */
	protected $post_service;
	/**
	 * @var UserService
	 */
	protected $user_service;
	/**
	 * @var AssistantData
	 */
	protected $assistant_data;


	/**
	 * OnEnqueueScripts constructor.
	 *
	 * @param PostService $post_service
	 * @param UserService $user_service
	 * @param AssistantData $assistant_data
	 *
	 * @todo refactor so these references come from a service locator or DI container
	 */
	public function __construct(
		PostService $post_service,
		UserService $user_service,
		AssistantData $assistant_data
	) {
		$this->post_service   = $post_service;
		$this->user_service   = $user_service;
		$this->assistant_data = $assistant_data;
	}

	/**
	 * @return PostService
	 */
	public function getPostService() {
		return $this->post_service;
	}

	/**
	 * @param PostService $post_service
	 */
	public function setPostService( $post_service ) {
		$this->post_service = $post_service;
	}

	/**
	 * @return UserService
	 */
	public function getUserService() {
		return $this->user_service;
	}

	/**
	 * @param UserService $user_service
	 */
	public function setUserService( $user_service ) {
		$this->user_service = $user_service;
	}

	/**
	 * @return AssistantData
	 */
	public function getAssistantData() {
		return $this->assistant_data;
	}

	/**
	 * @param AssistantData $assistant_data
	 */
	public function setAssistantData( $assistant_data ) {
		$this->assistant_data = $assistant_data;
	}

	public function generate_initial_state() {
		$user_state = $this->user_service->get_current_state();

		$this->state = [
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
	 * Compiles an array of all assistant data.
	 *
	 * NOTE: Kept in alphabetical order.
	 */
	public function generate_frontend_config() {

		$this->config = [
			'ajaxUrl'         => admin_url( 'admin-ajax.php' ),
			'apiRoot'         => esc_url_raw( get_rest_url() ),
			'contentTypes'    => $this->post_service->get_types(),
			'contentStatus'   => $this->post_service->get_stati(),
			'currentPageView' => $this->assistant_data->get_current_view(),
			'currentUser'     => $this->user_service->get_current_data(),
			'adminURLs'       => $this->assistant_data->get_admin_urls(),
			'defaultAppName'  => 'fl-dashboard',
			'nonce'           => [
				'api'             => wp_create_nonce( 'wp_rest' ),
				'reply'           => wp_create_nonce( 'replyto-comment' ),
				'replyUnfiltered' => wp_create_nonce( 'unfiltered-html-comment' ),
				'updates'         => wp_create_nonce( 'updates' ),
			],
			'pluginURL'       => FL_ASSISTANT_URL,
			'taxonomies'      => $this->post_service->get_taxononies(),
			'userRoles'       => $this->user_service->get_roles(),
		];

	}

	/**
	 * Returns an array of all counts to hydrate the store.
	 * @todo get this data without calling our own rest api
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

	public function enqueue() {
		$url = FL_ASSISTANT_URL;
		$ver = FL_ASSISTANT_VERSION;

		wp_register_script( 'fl-vendors', $url . 'build/fl-assistant-vendors.bundle.js', false, $ver, false );

		if ( $this->should_enqueue() ) {
			$this->generate_frontend_config();
			$this->generate_initial_state();

			// API - loaded in header
			$js_deps = array( 'heartbeat', 'wp-i18n', 'fl-vendors' );

			wp_enqueue_style( 'fl-assistant', $url . 'build/fl-assistant-api.bundle.css', array(), $ver, null );
			wp_enqueue_script( 'fl-assistant', $url . 'build/fl-assistant-api.bundle.js', $js_deps, $ver, false );

			wp_localize_script( 'fl-assistant', 'FL_ASSISTANT_CONFIG', $this->config );
			wp_localize_script( 'fl-assistant', 'FL_ASSISTANT_INITIAL_STATE', $this->state );

			// Apps - loaded in header
			wp_enqueue_style( 'fl-assistant-apps', $url . 'build/fl-assistant-apps.bundle.css', array(), $ver, null );
			wp_enqueue_script( 'fl-assistant-apps', $url . 'build/fl-assistant-apps.bundle.js', $js_deps, $ver, false );

			// UI - loaded in footer
			wp_enqueue_style( 'fl-assistant-ui', $url . 'build/fl-assistant-ui.bundle.css', array(), $ver, null );
			wp_enqueue_script( 'fl-assistant-ui', $url . 'build/fl-assistant-ui.bundle.js', $js_deps, $ver, true );
		}
	}

	public function __invoke() {
		$this->enqueue();
	}
}
