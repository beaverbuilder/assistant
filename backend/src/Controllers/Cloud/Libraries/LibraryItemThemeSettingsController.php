<?php

namespace FL\Assistant\Controllers\Cloud\Libraries;

use FL\Assistant\System\Contracts\ControllerAbstract;
use FL\Assistant\Clients\Cloud\CloudClient;
use FL\Assistant\Services\CustomizerService;
use FL\Assistant\Services\MediaLibraryService;
use FL\Assistant\Helpers\MediaPathHelper;
use FL\Assistant\Helpers\ScreenshotHelper;

class LibraryItemThemeSettingsController extends ControllerAbstract {

	public function register_routes() {
		$this->route(
			'/library/(?P<library_id>\d+)/library-items/export/theme-settings', [
				[
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'export' ],
					'args'                => [
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

		$this->route(
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
				'screenshot' => ScreenshotHelper::get_for_request( $request, home_url(), false ),
			]
		);
	}

	public function import( $request ) {
		$item = $request->get_param( 'item' );
		$service = new CustomizerService();

		if ( ! is_array( $item ) || empty( $item['data'] ) ) {
			return rest_ensure_response( [ 'error' => __( 'Missing item data.' ) ] );
		}

		$can_import = $service->can_import_settings( $item['data'] );

		if ( is_wp_error( $can_import ) ) {
			return rest_ensure_response( [
				'error' => $can_import->get_error_message()
			] );
		}

		$data = $this->import_media_from_library( $item );
		$service->import_settings( $data );

		return rest_ensure_response( [
			'success' => true
		] );
	}

	public function import_media_from_library( $item ) {
		$service = new MediaLibraryService();
		$data = $item['data'];
		$media = $item['media'];

		if ( isset( $media['attachments'] ) ) {
			$imported = [];
			foreach ( $media['attachments'] as $attachment ) {
				$response = $service->import_cloud_media( $attachment );
				$imported[ $attachment['file_name'] ] = wp_get_attachment_metadata( $response['id'] );
				$imported[ $attachment['file_name'] ]['id'] = $response['id'];
			}
		}

		return MediaPathHelper::replace_imported_attachment_urls_in_data( $data, $imported );
	}
}
