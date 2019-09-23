<?php

namespace FL\Assistant\Controllers;

use Exception;
use FL\Assistant\Data\Repository\UsersRepository;
use FL\Assistant\Data\Transformers\UserTransformer;
use FL\Assistant\Data\UserState;
use FL\Assistant\System\Contracts\ControllerAbstract;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * REST API logic for users.
 */
class UsersController extends ControllerAbstract {

	/**
	 * @var UsersRepository
	 */
	protected $users;
	/**
	 * @var UserTransformer
	 */
	protected $transformer;

	public function __construct( UsersRepository $users, UserTransformer $transformer ) {
		$this->users = $users;
		$this->transformer = $transformer;
	}


	/**
	 * Register routes.
	 */
	public function register_routes() {
		$this->route(
			'/users', [
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'index' ],
					'permission_callback' => function () {
						return current_user_can( 'list_users' );
					},
				],
			]
		);

		$this->route(
			'/users/(?P<id>\d+)', [
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'read' ],
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

	}

	/**
	 * Returns an array of users and related data.
	 *
	 * @param WP_REST_Request $request
	 *
	 * @return mixed|WP_REST_Response
	 */
	public function index( WP_REST_Request $request ) {

		$params = $request->get_params();
		$pager  = $this->users->paginate( $params, $this->transformer );

		return rest_ensure_response( $pager->to_array() );
	}

	/**
	 * Returns data for a single user.
	 *
	 * @param WP_REST_Request $request
	 *
	 * @return mixed|WP_REST_Response
	 * @throws Exception
	 */
	public function read( WP_REST_Request $request ) {
		$id   = $request->get_param( 'id' );
		$user = $this->users->find( $id, $this->transformer );

		return rest_ensure_response( $user );
	}

	/**
	 * Returns an array of counts by user role.
	 *
	 * @param WP_REST_Request $request
	 *
	 * @return mixed|WP_REST_Response
	 * @throws Exception
	 */
	public function users_count( WP_REST_Request $request ) {

		$response = $this->users->counts_by_user_role();

		return rest_ensure_response( $response );
	}




}
