<?php

namespace FL\Assistant\Controllers\Cloud\Libraries;

use FL\Assistant\System\Contracts\ControllerAbstract;
use FL\Assistant\Services\MediaLibraryService;

class LibraryItemImageController extends ControllerAbstract {

	public function register_routes() {
		$this->route(
			'/library-items/import/image', [
				[
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'import' ],
					'permission_callback' => function () {
						return current_user_can( 'edit_others_posts' );
					},
				],
			]
		);
	}

	/**
	 * Import an image library item into the site.
	 */
	public function import( $request ) {
		$item = $request->get_param( 'item' );

		if ( ! is_array( $item ) || ! isset( $item['media']['file'] ) ) {
			return rest_ensure_response( [ 'error' => __( 'Missing item data.' ) ] );
		}

		$url = $item['media']['file']['url'];
		$service = new MediaLibraryService();
		$response = $service->import_image( $url, $item['name'] );

		return rest_ensure_response( $response );
	}
}
