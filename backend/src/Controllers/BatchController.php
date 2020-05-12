<?php

namespace FL\Assistant\Controllers;

use FL\Assistant\System\Contracts\ControllerAbstract;
use WP_REST_Server;
use WP_REST_Request;

/**
 * REST API logic for batch requests.
 */
class BatchController extends ControllerAbstract {

	/**
	 * Register routes.
	 */
	public function register_routes() {
		$this->route(
			'/batch', [
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_batch' ],
					'permission_callback' => function () {
						return current_user_can( 'edit_others_posts' );
					},
				],
			]
		);
	}

	/**
	 * @param \WP_REST_Request $request
	 *
	 * @return mixed|\WP_REST_Response
	 */
	public function get_batch( \WP_REST_Request $request ) {
		$routes = $request->get_param( 'routes' );
		$response = [];

		foreach ( $routes as $route ) {
			$request  = new WP_REST_Request( 'GET', $route );
			$result = rest_do_request( $request );
			$response[ $route ] = $result->get_data();
		}

		return rest_ensure_response( $response );
	}
}
