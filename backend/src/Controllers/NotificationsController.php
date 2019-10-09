<?php

namespace FL\Assistant\Controllers;

use FL\Assistant\System\Contracts\ControllerAbstract;
use WP_REST_Request;
use WP_REST_Server;

/**
 * REST API logic for notifications.
 */
final class NotificationsController extends ControllerAbstract {

	/**
	 * Register routes.
	 */
	public function register_routes() {
		$this->route(
			'/notifications/count', [
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'count' ],
					'permission_callback' => function () {
						return is_user_logged_in();
					},
				],
			]
		);
	}

	/**
	 * Returns the notification count for the current user.
	 * @todo get these values from data service
	 */
	public function count( $request ) {
		$result = [
			'total' => 0,
		];

		// Comments count
		$request         = new WP_REST_Request( 'GET', '/fl-assistant/v1/comments/count' );
		$response        = rest_do_request( $request );
		$data            = $response->get_data();
		$result['total'] += isset( $data['pending'] ) ? $data['pending'] : 0;

		// Updates count
		$request         = new WP_REST_Request( 'GET', '/fl-assistant/v1/updates/count' );
		$response        = rest_do_request( $request );
		$data            = $response->get_data();
		$result['total'] += isset( $data['total'] ) ? $data['total'] : 0;

		return $result;
	}
}
