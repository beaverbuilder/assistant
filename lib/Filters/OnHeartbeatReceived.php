<?php


namespace FL\Assistant\Filters;

/**
 * Called on the heartbeat_received action.
 */
class OnHeartbeatReceived {

	public function __invoke( $response, $data ) {
		do_action( 'rest_api_init' );

		foreach ( $data as $key => $route ) {
			if ( strstr( $key, 'fl-assistant-' ) ) {
				$request          = array_reduce( array( $route ), 'rest_preload_api_request', array() );
				$response[ $key ] = $request[ $route ]['body'];
			}
		}

		return $response;
	}

}
