<?php


namespace FL\Assistant\System\Util;


class PhpVersionCheck {

	public function check() {
		if ( ! $this->is_minimum_php_version() ) {
			$this->admin_notice_hooks();
			return;
		}
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
