<?php

namespace FL\Assistant\Services;

use FL\Assistant\Services\ThemeService;
use FL\Assistant\Helpers\CustomizerOptionHelper;

class CustomizerService {

	/**
	 * @return array
	 */
	public function export_settings() {
		$wp_customize = $this->init_customizer();
		$theme_service = new ThemeService();
		$theme = $theme_service->get_current_theme_data();

		$data = array(
			'mods' => array(),
			'options' => array(),
			'css' => '',
			'theme' => $theme,
		);

		$ignore = array(
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
		);

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

		return $data;
	}

	/**
	 * @param array $data
	 * @return bool|WP_Error
	 */
	public function can_import_settings( $data ) {
		$theme = $data['theme'];
		$slug = $theme['slug'];
		$parentSlug = $theme['parent'] ? $theme['parent']['slug'] : null;
		$stylesheet = get_stylesheet();
		$template = get_template();

		if ( $slug !== $stylesheet && $slug !== $template && $parentSlug !== $stylesheet ) {
			return new \WP_Error( 'import', __( 'Import failed! These settings are not for the current theme.' ) );
		}

		return true;
	}

	/**
	 * @param array $data
	 * @return bool|WP_Error
	 */
	public function import_settings( $data ) {
		$wp_customize = $this->init_customizer();
		$can_import = $this->can_import_settings( $data );

		if ( is_wp_error( $can_import ) ) {
			return $can_import;
		}

		foreach ( $data['options'] as $option_key => $option_value ) {
			$option = new CustomizerOptionHelper( $wp_customize, $option_key, array(
				'default'		=> '',
				'type'			=> 'option',
				'capability'	=> 'edit_theme_options'
			) );
			$option->import( $option_value );
		}

		if( function_exists( 'wp_update_custom_css_post' ) && $data['css'] ) {
			wp_update_custom_css_post( $data['css'] );
		}

		do_action( 'customize_save', $wp_customize );

		foreach ( $data['mods'] as $key => $val ) {
			do_action( 'customize_save_' . $key, $wp_customize );
			set_theme_mod( $key, $val );
		}

		do_action( 'customize_save_after', $wp_customize );

		return true;
	}

	/**
	 * Dynamically initialize the customizer. Inspired by the core
	 * function _wp_customize_publish_changeset.
	 *
	 * @return object
	 */
	protected function init_customizer() {
		global $wp_customize;

		if ( ! class_exists( 'WP_Customize_Manager' ) ) {
			require_once ABSPATH . WPINC . '/class-wp-customize-manager.php';
		}
		if ( ! $wp_customize ) {
			$wp_customize = new \WP_Customize_Manager();
		}
		if ( ! did_action( 'customize_register' ) ) {
			remove_action( 'customize_register', array( $wp_customize, 'register_controls' ) );
			$wp_customize->register_controls();
			do_action( 'customize_register', $wp_customize );
		}

		return $wp_customize;
	}
}
