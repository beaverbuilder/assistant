<?php


namespace FL\Assistant\Providers;

use FL\Assistant\Core\Container;

use FL\Assistant\Data\PostData;
use FL\Assistant\Data\SiteData;
use FL\Assistant\Data\UserData;

use FL\Assistant\Actions\OnEnqueueScripts;
use FL\Assistant\Filters\OnHeartbeatReceived;

/**
 * Class PluginProvider
 * @package FL\Assistant\Providers\
 */
class PluginProvider implements ProviderInterface {

	/**
	 * @param Container $container
	 *
	 * @throws \Exception
	 */
	public function register( Container $container ) {
		// Display errors if using outdated PHP
		if ( ! $this->is_minimum_php_version() ) {
			$this->admin_notice_hooks();

			return;
		}

		$container->register_service(
			'users', function() {
				return new UserData();
			}
		);
		$container->register_service(
			'posts', function() {
				return new PostData();
			}
		);
		$container->register_service(
			'site', function() {
				return new SiteData();
			}
		);

		$this->register_hooks( $container );
	}

	/**
	 * @param Container $container
	 *
	 * @throws \Exception
	 */
	public function register_hooks( Container $container ) {
		// Enqueue Assistant frontend
		$enqueue_scripts = new OnEnqueueScripts( $container );
		add_action( 'wp_enqueue_scripts', $enqueue_scripts );
		add_action( 'admin_enqueue_scripts', $enqueue_scripts );

		// setup heartbeat
		add_filter( 'heartbeat_received', new OnHeartbeatReceived(), 11, 2 );

		// register activation hook
		register_activation_hook(
			FL_ASSISTANT_FILE, function () {
				do_action( 'fl_assistant_activate' );
			}
		);

		// notify assistant was loaded
		do_action( 'fl_assistant_loaded' );
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

	/**
	 * @return bool
	 */
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
