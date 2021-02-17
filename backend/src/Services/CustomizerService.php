<?php

namespace FL\Assistant\Services;

use FL\Assistant\Services\ThemeService;

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
			if ( 'option' == $setting->type ) {
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
	 * @return void
	 */
	public function import_settings( $data ) {
		$wp_customize = $this->init_customizer();
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
