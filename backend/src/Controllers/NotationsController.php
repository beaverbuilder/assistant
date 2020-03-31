<?php

namespace FL\Assistant\Controllers;

use FL\Assistant\Data\Repository\NotationsRepository;
use FL\Assistant\System\Contracts\ControllerAbstract;
use WP_REST_Server;

/**
 * REST API logic for notations.
 */
class NotationsController extends ControllerAbstract {

	/**
	 * @var NotationsRepository
	 */
	protected $notations;

	/**
	 * NotationsController constructor.
	 *
	 * @param NotationsRepository $notations
	 */
	public function __construct( NotationsRepository $notations ) {
		$this->notations = $notations;
	}

	/**
	 * Register routes.
	 */
	public function register_routes() {
		$this->route(
			'/notations/delete-where-meta', [
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'delete_notation' ],
					'permission_callback' => function () {
						return current_user_can( 'edit_others_posts' );
					},
				],
			]
		);
	}

	/**
	 * Deletes notations.
	 *
	 * @param \WP_REST_Request $request
	 *
	 * @return mixed|\WP_REST_Response
	 */
	public function delete_notation( \WP_REST_Request $request ) {
		$meta      = $request->get_params();
		$notations = $this->notations->get_by_meta( $meta );

		foreach ( $notations as $notation ) {
			if ( ! current_user_can( 'edit_post', $notation['id'] ) ) {
				return rest_ensure_response(
					[
						'error' => true,
					]
				);
			}
			wp_delete_post( $notation['id'] );
		}

		return rest_ensure_response(
			[
				'success' => true,
			]
		);
	}
}
