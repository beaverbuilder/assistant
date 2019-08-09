<?php

namespace FL\Assistant\Controllers;

use FL\Assistant\Pagination\UsersPaginator;
use FL\Assistant\Services\Entity\User;

use \WP_REST_Server;

/**
 * REST API logic for users.
 */
final class UsersController extends AssistantController {

	/**
	 * Register routes.
	 */
	public function register_routes() {
		$this->route(
			'/users', [
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'users' ],
					'permission_callback' => function () {
						return current_user_can( 'list_users' );
					},
				],
			]
		);

		$this->route(
			'/users/count', [
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'users_count' ],
					'permission_callback' => function () {
						return current_user_can( 'list_users' );
					},
				],
			]
		);

		$this->route(
			'/user/(?P<id>\d+)', [
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'user' ],
					'args'                => [
						'id' => [
							'required' => true,
							'type'     => 'number',
						],
					],
					'permission_callback' => function () {
						return current_user_can( 'list_users' );
					},
				],
			]
		);

		$this->route(
			'/current-user/state', [
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'update_user_state' ],
					'args'                => [
						'state' => [
							'required' => true,
							'type'     => 'json',
						],
					],
					'permission_callback' => function () {
						return ! ! wp_get_current_user()->ID;
					},
				],
			]
		);
	}

	/**
	 * Returns an array of users and related data.
	 *
	 * @param \WP_REST_Request $request
	 *
	 * @return mixed|\WP_REST_Response
	 */
	public function users( \WP_REST_Request $request ) {

		$params   = $request->get_params();

		$paginator = new UsersPaginator();
		$pager = $paginator->query($params, function($user) {
			$e = new User();
			return $e->hydrate($user);
		});

		return rest_ensure_response( $pager );
	}

	/**
	 * Returns an array of counts by user role.
	 *
	 * @param \WP_REST_Request $request
	 *
	 * @return mixed|\WP_REST_Response
	 * @throws \Exception
	 */
	public function users_count( \WP_REST_Request $request ) {

		$response = $this->container()
						 ->service( 'users' )
						 ->counts_by_user_role();

		return rest_ensure_response( $response );
	}

	/**
	 * Returns data for a single user.
	 *
	 * @param \WP_REST_Request $request
	 *
	 * @return mixed|\WP_REST_Response
	 * @throws \Exception
	 */
	public function user( \WP_REST_Request $request ) {
		$id   = $request->get_param( 'id' );
		$user = $this->container()
					 ->service( 'users' )
					 ->find( $id );

		return rest_ensure_response( $user->to_array() );
	}

	/**
	 * Updates the saved state for a user.
	 */
	public function update_user_state( \WP_REST_Request $request ) {

		$state = $request->get_param( 'state' );
		$user  = $this->container()->service( 'users' )->current();
		$user->update_state( $state );

		return rest_ensure_response( $user->get_state() );
	}
}
