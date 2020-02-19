<?php


namespace FL\Assistant\Hooks\Filters;

/**
 * Called on the heartbeat_received action.
 */
class OnHeartbeatReceived {

	/**
	 * @param $response
	 * @param $data
	 *
	 * @return mixed
	 */
	public function __invoke( $response, $data ) {
		do_action( 'rest_api_init', rest_get_server() );

		foreach ( $data as $key => $route ) {
			if ( strstr( $key, 'fl-assistant-' ) ) {
				$request          = array_reduce( [ $route ], 'rest_preload_api_request', [] );
				$response[ $key ] = $request[ $route ]['body'];
			}
		}

		return $response;
	}

}
