<?php

/**
 * Handles loading REST API related classes.
 *
 * @since 0.1
 */
final class FL_Assistant_REST {

	/**
	 * REST API namespace
	 *
	 * @since 0.1
	 * @var string $namespace
	 */
	static public $namespace = 'fl-assistant/v1';

	/**
	 * @since  0.1
	 * @return void
	 */
	static public function init() {
		if ( ! is_user_logged_in() ) {
			return;
		}

		include_once FL_ASSISTANT_DIR . 'classes/class-fl-assistant-rest-comments.php';
		include_once FL_ASSISTANT_DIR . 'classes/class-fl-assistant-rest-posts.php';
		include_once FL_ASSISTANT_DIR . 'classes/class-fl-assistant-rest-terms.php';
		include_once FL_ASSISTANT_DIR . 'classes/class-fl-assistant-rest-users.php';
	}
}

add_action( 'rest_api_init', 'FL_Assistant_REST::init' );
