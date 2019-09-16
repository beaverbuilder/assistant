<?php


namespace FL\Assistant\Controllers;

use FL\Assistant\System\Contracts\ControllerAbstract;
use WP_REST_Request;
use WP_REST_Server;

/**
 * Class SearchController
 *
 * Handles retrieving search results via the REST API.
 * Results are obtained by calling REST routes registered
 * in an Assistant app's config.
 *
 * @package FL\Assistant\Controllers
 */
class SearchController extends ControllerAbstract {

	public function register_routes() {
		$this->route(
			'/search', [
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'results' ],
					'permission_callback' => function () {
						return is_user_logged_in();
					},
				],
			]
		);
	}

	/**
	 * Returns search results for the endpoints sent
	 * in the current request.
	 *
	 * @param WP_REST_Request $request
	 *
	 * @return array
	 */
	public function results( WP_REST_Request $request ) {
		$response = [];
		$routes   = $request->get_param( 'routes' );
		$requests = array_reduce( $routes, 'rest_preload_api_request', [] );

		foreach ( $requests as $route => $request ) {
			$response[] = $request['body'];
		}

		return rest_ensure_response( $response );
	}
}
