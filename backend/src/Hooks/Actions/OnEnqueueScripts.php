<?php

namespace FL\Assistant\Hooks\Actions;

use FL\Assistant\Data\Repository\PostsRepository;
use FL\Assistant\Data\Repository\UsersRepository;
use FL\Assistant\Data\Site;
use FL\Assistant\Data\Transformers\UserTransformer;
use FL\Assistant\Data\UserState;
use FL\Assistant\Data\Mockup;
use FL\Assistant\Services\ThemeService;
use FLBuilderModel;

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
		$config = self::generate_frontend_config();
		$frame = $config[ 'frameDefaults' ];


		// Ensure shape of window property
		$window = $user_state['window'];
		// Ensure is set
		if ( ! isset( $window['width'] ) || null === $window['width'] ) {
			$window['width'] = $frame[ 'defaultWidth' ];
		}
		// Respect min and max width
		if ( $frame[ 'minWidth' ] > $window['width'] ) {
			$window['width'] = $frame[ 'minWidth' ];
		} else if ( $frame[ 'maxWidth' ] < $window[ 'width' ] ) {
			$window['width'] = $frame[ 'maxWidth' ];
		}

		// Set frame origin to top/right if not set.
		if ( ! isset( $window['origin'] ) || ! is_array( $window['origin'] ) ) {
			$window['origin'] = $frame[ 'defaultOrigin' ];
		}

		// Remove Deprecated properties
		if ( isset( $window['size'] ) ) {
			unset( $window['size'] );
		}
		if ( isset( $window['overlayToolbar'] ) ) {
			unset( $window['overlayToolbar'] );
		}

		// Always show in admin bar and hidden in wp-admin.
		if ( is_admin() ) {
			$window['isHidden'] = true;
			$window['hiddenAppearance'] = 'admin_bar';
		}

		$user_state['window'] = $window;

		return [
			'shouldShowLabels'   => false, /* Disabled */
			'appOrder'           => $user_state['appOrder'],
			'appearance'         => $user_state['appearance'],
			'history'            => $user_state['history'],
			'searchHistory'      => $user_state['searchHistory'],
			'window'             => $user_state['window'],
			'isAppHidden'        => $user_state['isAppHidden'] ? true : false,
			'hasSubscribed'      => isset( $user_state['hasSubscribed'] ) && $user_state['hasSubscribed'] ? true : false,
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
		$theme_service = new ThemeService();
		$theme = $theme_service->get_current_theme_data();

		return [
			'adminURLs'           => $this->site->get_admin_urls(),
			'ajaxUrl'             => admin_url( 'admin-ajax.php' ),
			'apiRoot'             => esc_url_raw( get_rest_url() ),
			'attachmentTypes'     => [
				'all'             => __( 'All', 'fl-assistant' ),
				'image'           => __( 'Photo', 'fl-assistant' ),
				'document'        => __( 'Document', 'fl-assistant' ),
				'video'           => __( 'Video', 'fl-assistant' ),
				'audio'           => __( 'Audio', 'fl-assistant' ),
			],
			'contentTypes'        => $this->posts->get_types(),
			'contentStatus'       => $this->posts->get_stati(),
			'currentPageView'     => $this->site->get_current_view(),
			'currentUser'         => $current_user,
			'defaultAppName'      => 'fl-home',
			'emptyTrashDays'      => EMPTY_TRASH_DAYS,
			'frameDefaults'       => UserState::getFrameDefaults(),
			'homeUrl' 			  => home_url(),
			'isShowingAdminBar'   => is_admin_bar_showing(),
			'isAdmin'             => is_admin(),
			'isSiteAdmin'         => is_super_admin(),
			'isLocalhost'         => $this->site->is_local(),
			'mockup'              => Mockup::get(),
			'nonce'               => [
				'api'             => wp_create_nonce( 'wp_rest' ),
				'reply'           => wp_create_nonce( 'replyto-comment' ),
				'replyUnfiltered' => wp_create_nonce( 'unfiltered-html-comment' ),
				'updates'         => wp_create_nonce( 'updates' ),
			],
			'pluginURL'           => FL_ASSISTANT_URL,
			'taxonomies'          => $this->posts->get_taxononies(),
			'userRoles'           => $this->users->get_roles(),
			'cloudConfig'         => [
				'apiUrl'          => FL_ASSISTANT_CLOUD_URL,
				'appUrl'          => FL_ASSISTANT_CLOUD_APP_URL,
				'pusherKey'       => FL_ASSISTANT_PUSHER_KEY,
				'pusherCluster'   => FL_ASSISTANT_PUSHER_CLUSTER,
			],
			'embedInBB'           => FL_ASST_SUPPORTS_BB,
			'themeSlug'           => $theme['slug'],
			'themeParentSlug'     => $theme['parent'] ? $theme['parent']['slug'] : null,
		];
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

		// Don't show in post previews.
		if ( isset( $_GET['fl_asst_post_preview'] ) ) {
			return false;
		}

		// User is logged in, and the current request is not customizer or an iframe
		$state = UserState::get();

		// Don't show Assistant in the WP Admin if the user has turned it off.
		if ( is_admin() && ! $state['shouldShowInAdmin'] ) {
			return false;
		}

		// There is no read-only assistant (for now). Users must be able to edit.
		if ( ! current_user_can( 'edit_others_posts' ) ) {
			return false;
		}

		return true;
	}

	public function register_vendors() {

		$url = FL_ASSISTANT_URL;
		$ver = FL_ASSISTANT_VERSION;

		// Bundled vendors
		// These vendors are special in that they attache a global reference to themselves on the FL.vendors object.
		// classnames
		wp_register_script( 'classnames', $url . 'build/vendor-classnames.js', [], $ver, false );

		// redux
		wp_register_script( 'redux', $url . 'build/vendor-redux.js', [], $ver, false );

		// react-router-dom
		wp_register_script( 'react-router-dom', $url . 'build/vendor-react-router-dom.js', [ 'react' ], $ver, false );

		// framer-motion
		wp_register_script( 'framer-motion', $url . 'build/vendor-framer-motion.js', [ 'react' ], $ver, false );

		// react-laag
		wp_register_script( 'react-laag', $url . 'build/vendor-react-laag.js', [ 'react' ], $ver, false );

		// HTML2Canvas
		wp_register_script( 'html2canvas', $url . 'build/vendor-html2canvas.js', [], $ver, false );

		// @beaverbuilder/app-core
		wp_register_script( 'bb-app-core', $url . 'build/vendor-bb-app-core.js', [ 'react', 'redux' ], $ver, false );

		// @beaverbuilder/cloud
		wp_register_script( 'bb-cloud', $url . 'build/vendor-bb-cloud.js', [ 'react' ], $ver, false );

		// @beaverbuilder/icons
		wp_register_script( 'bb-icons', $url . 'build/vendor-bb-icons.js', [ 'react' ], $ver, false );

		// @beaverbuilder/fluid
		$fluid_deps = [
			'react',
			'react-dom',
			'redux',
			'react-router-dom',
			'classnames',
			'framer-motion',
			'react-laag',
			'wp-i18n',
			'bb-icons'
		];
		wp_register_script( 'bb-fluid', $url . 'build/vendor-bb-fluid.js', $fluid_deps, $ver, false );
		wp_register_style( 'bb-fluid', $url . 'build/vendor-bb-fluid.css', [], $ver, null );

		// @beaverbuilder/forms
		wp_register_script( 'bb-forms', $url . 'build/vendor-bb-forms.js', [ 'bb-fluid' ], $ver, false );
		wp_register_style( 'bb-forms', $url . 'build/vendor-bb-forms.css', [ 'bb-fluid' ], $ver, null );

	}

	/**
	 * Enqueue all scripts and styles
	 */
	public function enqueue() {

		$url = FL_ASSISTANT_URL;
		$ver = FL_ASSISTANT_VERSION;

		if ( $this->should_enqueue() ) {

			self::register_vendors();

			$config = $this->generate_frontend_config();
			$state  = $this->generate_initial_state();

			// API - loaded in header
			$js_deps = [
				'wp-i18n',
				'wp-keycodes',
				'wp-dom-ready',
				'wp-components',
				'wp-date',
				'bb-fluid',
				'bb-forms',
				'bb-app-core',
				'bb-cloud',
				'bb-icons'
			];
			$css_deps = [
				'bb-fluid',
				'bb-forms',
				'wp-components'
			];

			// System - loaded in header
			wp_enqueue_style( 'fl-assistant', $url . 'build/system.css', $css_deps, $ver, null );
			wp_enqueue_script( 'fl-assistant', $url . 'build/system.js', $js_deps, $ver, false );

			wp_localize_script( 'fl-assistant', 'FL_ASSISTANT_CONFIG', $config );
			wp_localize_script( 'fl-assistant', 'FL_ASSISTANT_INITIAL_STATE', $state );

			// Apps - loaded in footer
			wp_enqueue_script( 'fl-assistant-apps', $url . 'build/apps.js', [ 'fl-assistant', 'html2canvas' ], $ver, true );

			// Currently don't need apps stylesheet
			//wp_enqueue_style( 'fl-assistant-apps', $url . 'build/apps.css', [ 'fl-assistant' ], $ver, null );

			// Render - loaded in footer
			wp_enqueue_script( 'fl-assistant-render', $url . 'build/render.js', [ 'fl-assistant' ], $ver, true );
			wp_enqueue_style( 'fl-assistant-render', $url . 'build/render.css', [ 'fl-assistant' ], $ver, null );

			// WordPress Media Uploader
			wp_enqueue_media();

			do_action( 'fl_assistant_enqueue' );
		}
	}

	public function __invoke() {
		$this->enqueue();
	}
}
