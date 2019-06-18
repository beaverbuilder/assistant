<?php

/**
 * Handles enqueuing css and js assets for the UI
 * in addition to setup of the initial frontend data.
 */
class FL_Assistant_Asset_Loader {

	/**
	 * Initialize the backend application.
	 */
	static public function init() {
		add_action( 'wp_enqueue_scripts', __CLASS__ . '::enqueue' );
		add_action( 'admin_enqueue_scripts', __CLASS__ . '::enqueue' );
	}

	/**
	 * Enqueue frontend resources - fired on wp_enqueue_scripts action.
	 */
	static public function enqueue() {
		$url = FL_ASSISTANT_URL;
		$ver = FL_ASSISTANT_VERSION;

		wp_register_script( 'fl-vendors', $url . 'build/fl-assistant-vendors.bundle.js', false, $ver, false );

		if ( self::should_enqueue() ) {

			// API - loaded in header
			$js_deps = array( 'heartbeat', 'wp-i18n', 'fl-vendors' );

			wp_enqueue_style( 'fl-assistant', $url . 'build/fl-assistant-api.bundle.css', array(), $ver, null );
			wp_enqueue_script( 'fl-assistant', $url . 'build/fl-assistant-api.bundle.js', $js_deps, $ver, false );

			$data = FL_Assistant_Data::get_all();
			wp_localize_script( 'fl-assistant', 'FL_ASSISTANT_CONFIG', $data['config'] );
			wp_localize_script( 'fl-assistant', 'FL_ASSISTANT_INITIAL_STATE', $data['state'] );

			// Apps - loaded in header
			wp_enqueue_style( 'fl-assistant-apps', $url . 'build/fl-assistant-apps.bundle.css', array(), $ver, null );
			wp_enqueue_script( 'fl-assistant-apps', $url . 'build/fl-assistant-apps.bundle.js', $js_deps, $ver, false );

			// UI - loaded in footer
			wp_enqueue_style( 'fl-assistant-ui', $url . 'build/fl-assistant-ui.bundle.css', array(), $ver, null );
			wp_enqueue_script( 'fl-assistant-ui', $url . 'build/fl-assistant-ui.bundle.js', $js_deps, $ver, true );
		}
	}

	/**
	 * Check if the frontend scripts/styles should be enqueued
	 */
	static public function should_enqueue() {

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
}

FL_Assistant_Asset_Loader::init();
