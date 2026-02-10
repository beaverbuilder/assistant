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
	public function export_to_cloud( $library_id, $subtype, $options ) {		
		$client = new CloudClient;

		if ( $subtype === 'theme_settings' ) {
			$theme = wp_get_theme();
			$data = $this->export_theme_settings();
			$name = sprintf( _x( '%s Settings', '%s theme name', 'assistant' ), $theme->Name );
		} elseif ( $subtype === 'bb_settings' ) {
			if ( ! class_exists( '\FLBuilderModel') ) {
				return rest_ensure_response( [ 'error' => __( 'Unable to load BeaverBuilder settings exporter.' ) ] );
			}

			if ( ! current_user_can( 'manage_options' ) ) {
				return rest_ensure_response( [ 'error' => __( 'You do not have permission to export BeaverBuilder settings.' ) ] );
			}

			$possible_options = [
				'admin_settings',
				'global_settings',
				'global_styles',
				'global_colors',
			];
			$settings = [];
			$settings['builder_global_settings'] = \FLBuilderModel::get_global_settings();
			$settings['admin_settings'] = [];
			$all_settings = true;
			$selected_settings = [];

			foreach ( \FLBuilderAdminSettings::registered_settings() as $setting ) {
				$settings['admin_settings'][ $setting ] = get_option( $setting );
			}

			if ( class_exists( 'FLBuilderGlobalStyles' ) ) {
				$globals = \FLBuilderGlobalStyles::get_settings( false );
				$settings['global_colors'] = $globals->colors;
				unset( $globals->colors );
				$settings['global_styles'] = $globals;
			}

			foreach ( $possible_options as $option ) {
				if ( ! in_array( $option, $options ) ) {
					$all_settings = false;
				}
			}

			if ( in_array( 'admin_settings', $options ) ) {
				$selected_settings[] = 'Admin';
			} else {
				unset( $settings['admin_settings'] );
			}

			if ( in_array( 'global_settings', $options ) ) {
				$selected_settings[] = 'Global Settings';
			} else {
				unset( $settings['builder_global_settings'] );
			}

			if ( in_array( 'global_styles', $options ) ) {
				$selected_settings[] = 'Styles';
			} else {
				unset( $settings['global_styles'] );
			}

			if ( in_array( 'global_colors', $options ) ) {
				$selected_settings[] = 'Colors';
			} else {
				unset( $settings['global_colors'] );
			}

			if ( isset( $settings['global_colors'] ) && isset ( $globals->prefix ) ) {
				$settings['global_colors_prefix'] = $globals->prefix;
			}

			if ( $all_settings ) {
				$name = 'All Settings';
			} else {
				$name = implode( ', ', $selected_settings );
			}

			$data = json_encode( $settings );
		}

		$screenshot = isset( $_POST['screenshot'] ) ? ScreenShotHelper::get_for_post_request( home_url(), false ) : null;

		return $client->libraries->create_item(
			$library_id,
			[
				'name'  => $name,
				'type'  => 'settings',
				'subtype' => $subtype,
				'data'  => $data,
				'media' => [
					'attachments' => is_array( $data ) ? MediaPathHelper::get_image_paths_from_array( $data ) : MediaPathHelper::get_image_paths_from_string( $data )
				],
				'screenshot' => $screenshot,
			]
		);
	}

	/**
	 * @return array
	 */
	public function export_theme_settings() {
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

		if ($item->subtype === 'theme_settings') {
			return $this->import_theme_settings_from_cloud( $item );
		} elseif ( $item->subtype === 'bb_settings' ) {
			// Convert settings back into array
			$item->data = json_decode(json_encode($item->data), true);
			return $this->import_bb_settings( $item );
		} else {
			return rest_ensure_response( [ 'error' => __( 'Unsupported settings type.' ) ] );
		}
	}

	public function import_theme_settings_from_cloud( $item ) {
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
		$this->import_theme_settings( $data );		

		return rest_ensure_response( [
			'success' => true
		] );
	}

	public function import_bb_settings( $item ) {
		$data = $item->data;

		if ( !class_exists( '\FLBuilderModel') ) {
			return rest_ensure_response( [ 'error' => __( 'Unable to load BeaverBuilder settings importer.' ) ] );
		}

		if ( ! current_user_can( 'manage_options' ) ) {
			return rest_ensure_response( [ 'error' => __( 'You do not have permission to export BeaverBuilder settings.' ) ] );
		}

		if ( isset( $data['builder_global_settings'] ) ) {
			update_option( '_fl_builder_settings', $data['builder_global_settings'], true );
		}

		// loop through admin settings
		if ( isset( $data['admin_settings'] ) ) {
			$settings = $data['admin_settings'];

			foreach ( $settings as $key => $setting ) {
				update_option( $key, $setting, true );
			}
		}

		$globals = get_option( '_fl_builder_styles' );
		if ( isset( $data['global_styles'] ) ) {
			$backup_colors        = isset( $globals->colors ) ? $globals->colors : array();
			$new_settings         = (object) $data['global_styles'];
			$new_settings->colors = $backup_colors;
			$globals              = $new_settings;
			\FLBuilderUtils::update_option( '_fl_builder_styles', $globals, true );
		}

		// global styles/colors...
		if ( isset( $data['global_colors'] ) ) {
			// get current settings and swap out colours
			$globals = $globals ? $globals : \FLBuilderGlobalStyles::get_settings( false );
			$current = $globals->colors;

			$new = array_merge( (array) $current, (array) $data['global_colors'] );

			// filter out duplicates
			$serialized      = array_map( 'serialize', $new );
			$unique          = array_unique( $serialized );
			$globals->colors = array_intersect_key( $new, $unique );

			foreach ( $globals->colors as $k => $color ) {
				if ( empty( $color ) || ! $color['color'] ) {
					unset( $globals->colors[ $k ] );
				}
			}

			if ( isset( $data->global_colors_prefix ) ) {
				$globals->prefix = $data->global_colors_prefix;
			}

			// Fixes global colors not starting with 0 key
			$globals->colors = array_values( $globals->colors );

			\FLBuilderUtils::update_option( '_fl_builder_styles', $globals, true );
		}

		\FLBuilderModel::delete_asset_cache_for_all_posts();
		
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
	public function import_theme_settings( $data ) {
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
