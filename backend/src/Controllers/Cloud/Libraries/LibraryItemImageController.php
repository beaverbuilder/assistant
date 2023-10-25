<?php

namespace FL\Assistant\Controllers\Cloud\Libraries;

use FL\Assistant\System\Contracts\ControllerAbstract;
use FL\Assistant\Services\MediaLibraryService;
use FL\Assistant\Clients\Cloud\CloudClient;

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

		$this->route(
			'/images/(?P<id>\d+)/library/(?P<library_id>\d+)', [
				[
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'export' ],
					'args'                => [
						'id'         => [
							'required' => true,
							'type'     => 'number',
						],
						'library_id' => [
							'required' => true,
							'type'     => 'number',
						],
					],
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

		$media = (object) $item['media']['file'];
		$service = new MediaLibraryService();
		$response = $service->import_cloud_media( $media );

		if ( $response && isset( $response['id'] ) && !empty( $item['data']['alt'] ) ) {
			update_post_meta( $response['id'], '_wp_attachment_image_alt', $item['data']['alt'] );
		}

		return rest_ensure_response( $response );
	}

	/**
	 * Export an image from the site to a library.
	 */
	public function export( $request ) {
		$id = $request->get_param( 'id' );
		$library_id = $request->get_param( 'library_id' );
		$attachment = get_post( $id );
		$client = new CloudClient;
		$path = get_attached_file( $id );
		$ext = pathinfo( $path, PATHINFO_EXTENSION );

		$data = [];

		$alt = get_post_meta( $id, '_wp_attachment_image_alt', true);

		if ( !empty( $alt ) ) {
			$data['alt'] = $alt;
		}

		return $client->libraries->create_item(
			$library_id,
			[
				'name'       => $attachment->post_title,
				'type'       => 'svg' === $ext ? 'svg' : 'image',
				'data'       => $data,
				'media'      => [
					'file'       => $path,
				],
			]
		);
	}
}
