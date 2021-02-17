<?php

namespace FL\Assistant\Controllers\Cloud\Libraries;

use FL\Assistant\System\Contracts\ControllerAbstract;
use FL\Assistant\Clients\Cloud\CloudClient;
use FL\Assistant\Services\CustomizerService;
use FL\Assistant\Helpers\MediaPathHelper;

class LibraryItemThemeSettingsController extends ControllerAbstract {

	public function register_routes() {
		$this->route(
			'/library-items/export/theme-settings', [
				[
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'export' ],
					'permission_callback' => function () {
						return current_user_can( 'edit_others_posts' );
					},
				],
			],
			'/library-items/import/theme-settings', [
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

	public function export( $request ) {
		$library_id = $request->get_param( 'library_id' );
		$client = new CloudClient;
		$service = new CustomizerService();
		$data = $service->export_settings();
		$theme = wp_get_theme();

		return $client->libraries->create_item(
			$library_id,
			[
				'name'  => sprintf( _x( '%s Settings', '%s theme name', 'fl-assistant' ), $theme->Name ),
				'type'  => 'theme_settings',
				'data'  => $data,
				'media' => [
					'attachments' => MediaPathHelper::get_image_paths_from_data( $data )
				],
			]
		);
	}

	public function import( $request ) {
		$item = $request->get_param( 'item' );

		if ( ! is_array( $item ) || empty( $item['data'] ) ) {
			return rest_ensure_response( [ 'error' => __( 'Missing item data.' ) ] );
		}

		// TODO: Figure out what response to send.
		return rest_ensure_response( [] );
	}
}
