<?php

/**
 * Handles working with REST endpoints via
 * the heartbeat API.
 */
class FL_Assistant_Heartbeat {

	/**
	 * @return void
	 */
	static public function init() {
		add_filter( 'heartbeat_settings', function( $settings ) {
			$settings['interval'] = 15;
			return $settings;
		} );
		add_filter( 'heartbeat_received', __CLASS__ . '::received', 11, 2 );
	}

	/**
	 * Called on the heartbeat_received action.
	 *
	 * @param array $response
	 * @param array $data
	 * @return array
	 */
	static public function received( $response, $data ) {
		FL_Assistant_REST::init();

		foreach ( $data as $key => $route ) {
			if ( strstr( $key, 'fl-assistant-' ) ) {
				$request = array_reduce( array( $route ), 'rest_preload_api_request', array() );
				$response[ $key ] = $request[ $route ]['body'];
			}
		}

		return $response;
	}
}

FL_Assistant_Heartbeat::init();
