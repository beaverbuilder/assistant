<?php

namespace FL\Assistant\Controllers;

use \WP_REST_Server;

/**
 * REST API logic for notations.
 */
class NotationsController extends AssistantController {

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
						return current_user_can( 'edit_published_posts' );
					},
				],
			]
		);
	}

	/**
	 * Deletes notations.
	 */
	public function delete_notation( $request ) {
		$meta = $request->get_params();
		$notations_service = $this->service( 'notations' );
		$notations = $notations_service->get_by_meta( $meta );

		foreach ( $notations as $notation ) {
			if ( ! current_user_can( 'edit_post', $notation->ID ) ) {
				return rest_ensure_response(
					[
						'error' => true,
					]
				);
			}
			wp_delete_post( $notation->ID );
		}

		return rest_ensure_response(
			[
				'success' => true,
			]
		);
	}
}
