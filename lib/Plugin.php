<?php

namespace FL\Assistant;

use FL\Assistant\Core\Traits\Singleton;

use FL\Assistant\Actions\OnEnqueueScripts;
use FL\Assistant\Actions\OnInitConfig;
use FL\Assistant\Actions\OnPluginActivate;
use FL\Assistant\Actions\OnRestApiInit;

use FL\Assistant\Filters\OnHeartbeatReceived;
use FL\Assistant\Services\PostService;
use FL\Assistant\Services\UserService;

/**
 * Sets up plugin constants and loads the necessary PHP files.
 * If the plugin can't be loaded, an admin notice is shown.
 */
class Plugin {

	use Singleton;

	protected function __construct() {

		if (! $this->is_minimum_php_version() ) {
			$this->admin_notice_hooks();

			return;
		}

		$this->load_assets()
		     ->register_hooks()
		     ->register_activation_hook()
		     ->notify_assistant_loaded();
	}

	/**
	 * Initialize the plugin.
	 */
	public static function init() {
		return static::instance();
	}

	protected function notify_assistant_loaded() {
		do_action( 'fl_assistant_loaded' );

		return $this;
	}

	protected function register_activation_hook() {
		register_activation_hook( FL_ASSISTANT_FILE, new OnPluginActivate() );

		return $this;
	}


	protected function load_assets() {

		$action = new OnEnqueueScripts(
			new PostService(),
			new UserService(),
			new AssistantData()
		);

		add_action( 'wp_enqueue_scripts', $action );
		add_action( 'admin_enqueue_scripts', $action );

		return $this;
	}

	protected function register_hooks() {
		add_action( 'rest_api_init', new OnRestApiInit() );
		add_filter( 'heartbeat_received', new OnHeartbeatReceived(), 11, 2 );

		return $this;
	}

	/**
	 * Initializes actions for the admin notice if the plugin can't load.
	 */
	protected function admin_notice_hooks() {
		global $pagenow;

		if ( 'plugins.php' === $pagenow ) {
			add_action( 'admin_notices', [ $this, 'admin_notice' ] );
			add_action( 'network_admin_notices', [ $this, 'admin_notice' ] );
		}
	}

	/**
	 * Shows an admin notice if the plugin can't load.
	 */
	protected function admin_notice() {
		if ( ! is_admin() ) {
			return;
		} elseif ( ! is_user_logged_in() ) {
			return;
		} elseif ( ! current_user_can( 'update_core' ) ) {
			return;
		}

		$message = $this->get_loading_error();

		if ( $message ) {
			echo '<div class="error">';
			echo '<p>' . sprintf( $message ) . '</p>';
			echo '</div>';
		}
	}

	protected function is_minimum_php_version() {
		return ! version_compare( phpversion(), '5.6', '<' );
	}

	/**
	 * Returns a plugin loading error if there is one.
	 */
	protected function get_loading_error() {

		$url = 'http://www.wpupdatephp.com/contact-host/';

		/* translators: php upgrade url. */
		return sprintf(
			__( 'Assistant requires PHP 5.6 or above. Please <a href="%s">update your PHP version</a> before continuing.', 'fl-assistant' ),
			$url
		);

	}
}

