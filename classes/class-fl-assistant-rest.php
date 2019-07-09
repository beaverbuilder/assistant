<?php

/**
 * Handles loading REST API related classes.
 */
final class FL_Assistant_REST {

	/**
	 * REST API namespace
	 */
	static public $namespace = 'fl-assistant/v1';

	/**
	 * Initialize REST classes.
	 */
	static public function init() {
		if ( ! is_user_logged_in() ) {
			return;
		}

		include_once FL_ASSISTANT_DIR . 'classes/class-fl-assistant-rest-attachments.php';
		include_once FL_ASSISTANT_DIR . 'classes/class-fl-assistant-rest-comments.php';
		include_once FL_ASSISTANT_DIR . 'classes/class-fl-assistant-rest-counts.php';
		include_once FL_ASSISTANT_DIR . 'classes/class-fl-assistant-rest-notifications.php';
		include_once FL_ASSISTANT_DIR . 'classes/class-fl-assistant-rest-posts.php';
		include_once FL_ASSISTANT_DIR . 'classes/class-fl-assistant-rest-search.php';
		include_once FL_ASSISTANT_DIR . 'classes/class-fl-assistant-rest-terms.php';
		include_once FL_ASSISTANT_DIR . 'classes/class-fl-assistant-rest-updates.php';
		include_once FL_ASSISTANT_DIR . 'classes/class-fl-assistant-rest-users.php';
	}
}

add_action( 'rest_api_init', 'FL_Assistant_REST::init' );
