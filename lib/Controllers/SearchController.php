<?php


namespace FL\Assistant\Controllers;


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
class SearchController extends AssistantController {

	public function register_routes() {
		$this->route(
			'/search', [
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'results' ],
					'permission_callback' => function() {
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
	 * @param \WP_REST_Request $request
	 *
	 * @return array
	 */
	public function results( \WP_REST_Request $request ) {
		$response  = [];
		$routes = $request->get_param( 'routes' );
		$requests = array_reduce( $routes, 'rest_preload_api_request', [] );
		$this->update_history( $request->get_param( 'keyword' ) );

		foreach ( $requests as $route => $request ) {
			$response[] = $request['body'];
		}
		return rest_ensure_response( $response );
	}

	/**
	 * Updates the current user's search history with
	 * the provided keyword.
	 *
	 * @param String $keyword
	 *
	 * @return void
	 */
	public function update_history( $keyword ) {
		$user  = $this->container()->service( 'users' )->current();
		$state = $user->get_state();
		$state['searchHistory'] = array_diff( $state['searchHistory'], [ $keyword ] );
		array_unshift( array_slice( $state['searchHistory'], 0, 9 ), $keyword );
		$user->update_state( $state );
	}
}
