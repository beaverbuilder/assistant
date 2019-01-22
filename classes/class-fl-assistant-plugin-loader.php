<?php

if ( ! class_exists( 'FL_Assistant_Plugin_Loader' ) ) {

	/**
	 * Sets up plugin constants and loads the necessary PHP files.
	 * If the plugin can't be loaded, an admin notice is shown.
	 *
	 * @since 0.1
	 */
	final class FL_Assistant_Plugin_Loader {

		/**
		 * Initialize the plugin.
		 *
		 * @since  0.1
		 * @return void
		 */
		static public function init() {
			if ( self::get_loading_error() ) {
				self::admin_notice_hooks();
				return;
			}

			self::define_constants();
			self::load_files();

			register_activation_hook( FL_ASSISTANT_FILE, __CLASS__ . '::activate' );
		}

		/**
		 * Define plugin constants.
		 *
		 * @since  0.1
		 * @return void
		 */
		static private function define_constants() {
			define( 'FL_ASSISTANT_VERSION', '0.1' );
			define( 'FL_ASSISTANT_FILE', trailingslashit( dirname( dirname( __FILE__ ) ) ) . 'fl-assistant.php' );
			define( 'FL_ASSISTANT_DIR', plugin_dir_path( FL_ASSISTANT_FILE ) );
			define( 'FL_ASSISTANT_URL', plugins_url( '/', FL_ASSISTANT_FILE ) );
		}

		/**
		 * Runs on plugin activation.
		 *
		 * @since 0.1
		 * @return void
		 */
		static public function activate() {
			do_action( 'fl_assistant_activate' );
		}

		/**
		 * Load plugin files.
		 *
		 * @since  0.1
		 * @return void
		 */
		static public function load_files() {
			require_once FL_ASSISTANT_DIR . 'classes/class-fl-assistant-asset-loader.php';
			require_once FL_ASSISTANT_DIR . 'classes/class-fl-assistant-rest.php';

			do_action( 'fl_assistant_loaded' );
		}

		/**
		 * Initializes actions for the admin notice if the plugin can't load.
		 *
		 * @since  0.1
		 * @access private
		 * @return void
		 */
		static private function admin_notice_hooks() {
			global $pagenow;

			if ( 'plugins.php' == $pagenow ) {
				add_action( 'admin_notices',           __CLASS__ . '::admin_notice' );
				add_action( 'network_admin_notices',   __CLASS__ . '::admin_notice' );
			}
		}

		/**
		 * Shows an admin notice if the plugin can't load.
		 *
		 * @since  0.1
		 * @return void
		 */
		static public function admin_notice() {
			if ( ! is_admin() ) {
				return;
			} elseif ( ! is_user_logged_in() ) {
				return;
			} elseif ( ! current_user_can( 'update_core' ) ) {
				return;
			}

			$message = self::get_loading_error();

			if ( $message ) {
				echo '<div class="error">';
				echo '<p>' . sprintf( $message ) . '</p>';
				echo '</div>';
			}
		}

		/**
		 * Returns a plugin loading error if there is one.
		 *
		 * @since  0.1
		 * @return bool|string
		 */
		static private function get_loading_error() {
			$error = false;

			if ( version_compare( phpversion(), '5.6', '<' ) ) {
				$url   = 'http://www.wpupdatephp.com/contact-host/';
				$error = sprintf( __( 'Assistant requires PHP 5.6 or above. Please <a href="%s">update your PHP version</a> before continuing.', 'fl-assistant' ), $url );
			}

			return $error;
		}
	}

	FL_Assistant_Plugin_Loader::init();
}
