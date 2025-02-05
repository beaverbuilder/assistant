<?php

namespace FL\Assistant\Services;

use FL\Assistant\Services\ThemeService;
use FL\Assistant\Helpers\CustomizerOptionHelper;
use FL\Assistant\Clients\Cloud\CloudClient;
use FL\Assistant\Helpers\MediaPathHelper;
use FL\Assistant\Helpers\ScreenshotHelper;
use FL\Assistant\Helpers\AstraSettingsHelper;

class CustomizerService {

	/**
	 * @var array
	 */
	private $helpers = [
		'astra' => AstraSettingsHelper::class,
	];

	/**
	 * @param int $library_id
	 * @return array
	 */
	public function export_to_cloud( $library_id ) {
		$client = new CloudClient;
		$data = $this->export_settings();
		$theme = wp_get_theme();
		$screenshot = isset( $_POST['screenshot'] ) ? ScreenShotHelper::get_for_post_request( home_url(), false ) : null;

		return $client->libraries->create_item(
			$library_id,
			[
				'name'  => sprintf( _x( '%s Settings', '%s theme name', 'assistant' ), $theme->Name ),
				'type'  => 'theme_settings',
				'data'  => $data,
				'media' => [
					'attachments' => MediaPathHelper::get_image_paths_from_data( $data )
				],
				'screenshot' => $screenshot,
			]
		);
	}

	/**
	 * @return array
	 */
	public function export_settings() {
		global $wp_customize;

		$theme_service = new ThemeService();
		$theme = $theme_service->get_current_theme_data();
		$template = get_template();

		$data = [
			'theme' => $theme,
			'mods' => [],
			'options' => [],
			'custom' => [],
			'css' => '',
		];

		$ignore = [
			'blogname',
			'blogdescription',
			'show_on_front',
			'page_on_front',
			'page_for_posts',
			'nav_menu_locations',
			'nav_menus_created_posts',
			'sidebars_widgets',
			'site_icon',
			'custom_css_post_id',
		];

		$mods = get_theme_mods();
		$settings = $wp_customize->settings();

		foreach ( $mods as $key => $value ) {
			if ( in_array( $key, $ignore ) ) {
				continue;
			}
			$data['mods'][ $key ] = $value;
		}

		foreach ( $settings as $key => $setting ) {
			if ( 'option' === $setting->type ) {
				if ( 0 === strpos( $key, 'widget_' ) || 0 === strpos( $key, 'sidebars_' ) ) {
					continue;
				} elseif ( in_array( $key, $ignore ) ) {
					continue;
				}
				$data['options'][ $key ] = $setting->value();
			}
		}

		if ( function_exists( 'wp_get_custom_css_post' ) ) {
			$data['css'] = wp_get_custom_css();
		}

		if ( isset( $this->helpers[ $template ] ) ) {
			$helper = new $this->helpers[ $template ];
			$data['custom'] = json_encode( $helper->export() );
		}

		return $data;
	}

	/**
	 * @param int $item_id
	 * @return array
	 */
	public function import_from_cloud( $item_id ) {
		$client = new CloudClient;
		$item = $client->libraries->get_item( $item_id );

		if ( ! is_object( $item ) || empty( $item->data ) ) {
			return rest_ensure_response( [ 'error' => __( 'Missing item data.' ) ] );
		}

		$can_import = $this->can_import_settings( $item->data );

		if ( is_wp_error( $can_import ) ) {
			return rest_ensure_response( [
				'error' => $can_import->get_error_message()
			] );
		}

		$data = $this->import_media_from_library( $item );
		$this->import_settings( $data );

		return rest_ensure_response( [
			'success' => true
		] );
	}

	public function import_media_from_library( $item ) {
		$service = new MediaLibraryService();
		$data = $item->data;
		$media = $item->media;
		$imported = [];

		if ( isset( $media->attachments ) ) {
			foreach ( $media->attachments as $attachment ) {
				$response = $service->import_cloud_media( $attachment );
				$imported[ $attachment->file_name ] = wp_get_attachment_metadata( $response['id'] );
				$imported[ $attachment->file_name ]['id'] = $response['id'];
			}
		}

		return MediaPathHelper::replace_imported_attachment_urls_in_data( $data, $imported );
	}

	/**
	 * @param array $data
	 * @return bool|WP_Error
	 */
	public function can_import_settings( $data ) {
		$theme = $data->theme;
		$slug = $theme->slug;
		$parent_slug = $theme->parent ? $theme->parent->slug : null;
		$stylesheet = get_stylesheet();
		$template = get_template();

		if ( ( $theme->parent && $parent_slug !== $template ) || ( $slug !== $stylesheet && $parent_slug !== $stylesheet ) ) {
			return new \WP_Error( 'import', __( 'Import failed! These settings are not for the current theme.' ) );
		}

		return true;
	}

	/**
	 * @param array $data
	 * @return bool|WP_Error
	 */
	public function import_settings( $data ) {
		global $wp_customize;

		$template = get_template();
		$can_import = $this->can_import_settings( $data );

		if ( is_wp_error( $can_import ) ) {
			return $can_import;
		}

		foreach ( $data->options as $option_key => $option_value ) {
			$option = new CustomizerOptionHelper( $wp_customize, $option_key, array(
				'default'		=> '',
				'type'			=> 'option',
				'capability'	=> 'edit_theme_options'
			) );
			$option->import( $option_value );
		}

		if( function_exists( 'wp_update_custom_css_post' ) && $data->css ) {
			wp_update_custom_css_post( $data->css );
		}

		do_action( 'customize_save', $wp_customize );

		foreach ( $data->mods as $key => $val ) {

			if( is_object( $val ) ) {
				$val = json_decode( json_encode( $val ), true );
			}
			do_action( 'customize_save_' . $key, $wp_customize );
			set_theme_mod( $key, $val );
		}

		if ( isset( $this->helpers[ $template ] ) ) {
			$helper = new $this->helpers[ $template ];
			$settings = json_decode( $data->custom, 1 );
			$helper->import( $settings );
		}

		do_action( 'customize_save_after', $wp_customize );

		return true;
	}
}
