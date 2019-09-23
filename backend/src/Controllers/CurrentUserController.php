<?php


namespace FL\Assistant\Controllers;


use FL\Assistant\Data\UserState;
use FL\Assistant\System\Contracts\ControllerAbstract;
use WP_REST_Request;
use WP_REST_Server;

class CurrentUserController extends ControllerAbstract {

	public function register_routes() {
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
	 * Updates the saved state for a user.
	 */
	public function update_user_state( WP_REST_Request $request ) {

		$state = $request->get_param( 'state' );
		UserState::update( $state );

		return rest_ensure_response( UserState::get() );
	}
}
