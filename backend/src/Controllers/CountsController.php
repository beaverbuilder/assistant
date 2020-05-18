<?php

namespace FL\Assistant\Controllers;

use FL\Assistant\System\Contracts\ControllerAbstract;
use WP_REST_Server;

/**
 * REST API logic for content count data.
 */
class CountsController extends ControllerAbstract {

	/**
	 * Register routes.
	 */
	public function register_routes() {
		$this->route(
			'/counts', [
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'all' ],
					'permission_callback' => function () {
						return is_user_logged_in();
					},
				],
			]
		);
	}

	/**
	 * Returns all counts for the site.
	 *
	 * @todo move this to data service and call data service
	 */
	public function all( $request ) {
		$routes = [
			'/fl-assistant/v1/posts/count'         => function ( $response ) {
				$return = [];
				foreach ( $response as $type => $data ) {
					$return[ 'content/' . $type ] = $data->total;
				}

				return $return;
			},
			'/fl-assistant/v1/terms/count'         => function ( $response ) {
				$return = [];
				foreach ( $response as $type => $count ) {
					$return[ 'taxonomy/' . $type ] = $count;
				}

				return $return;
			},
			'/fl-assistant/v1/attachments/count'   => function ( $response ) {
				$return = [];
				foreach ( $response as $type => $count ) {
					$return[ 'attachment/' . $type ] = $count;
				}

				return $return;
			},
			'/fl-assistant/v1/comments/count'      => function ( $response ) {
				$return = [];
				foreach ( $response as $type => $count ) {
					$return[ 'comment/' . $type ] = $count;
				}

				return $return;
			},
			'/fl-assistant/v1/users/count'         => function ( $response ) {
				$return = [];
				foreach ( $response as $type => $count ) {
					$return[ 'role/' . $type ] = $count;
				}

				return $return;
			},
			'/fl-assistant/v1/updates/count'       => function ( $response ) {
				$return = [];
				foreach ( $response as $type => $count ) {
					$return[ 'update/' . $type ] = $count;
				}

				return $return;
			},
			'/fl-assistant/v1/notifications/count' => function ( $response ) {
				$return = [];
				foreach ( $response as $type => $count ) {
					$return[ 'notification/' . $type ] = $count;
				}

				return $return;
			},
			'/fl-assistant/v1/labels/count'        => function ( $response ) {
				$return = [];
				foreach ( $response as $type => $count ) {
					$return[ 'label/' . $type ] = $count;
				}

				return $return;
			},
		];

		$requests = array_reduce( array_keys( $routes ), 'rest_preload_api_request', [] );
		$counts   = [];

		foreach ( $requests as $route => $request ) {
			$counts = array_merge( $counts, $routes[ $route ]( $request['body'] ) );
		}

		return $counts;
	}
}
