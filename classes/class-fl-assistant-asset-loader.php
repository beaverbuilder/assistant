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
	}

	/**
	 * Enqueue frontend resources - fired on wp_enqueue_scripts action.
	 */
	static public function enqueue() {
		$url = FL_ASSISTANT_URL;
		$ver = FL_ASSISTANT_VERSION;

		if ( self::should_enqueue() ) {
			$data = FL_Assistant_Data::get_all();
			wp_enqueue_script( 'heartbeat' );
			wp_enqueue_style( 'fl-assistant-front', $url . 'build/bundle.css', array(), $ver, null );
			wp_enqueue_script( 'fl-assistant-front', $url . 'build/bundle.js', array(), $ver, true );
			wp_localize_script( 'fl-assistant-front', 'FL_ASSISTANT_CONFIG', $data['config'] );
			wp_localize_script( 'fl-assistant-front', 'FL_ASSISTANT_INITIAL_STATE', $data['state'] );
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

		// There is no read-only assistant (for now). Users must be able to edit.
		if ( ! current_user_can( 'edit_published_posts' ) ) {
			return false;
		}

		return true;
	}
}

FL_Assistant_Asset_Loader::init();
