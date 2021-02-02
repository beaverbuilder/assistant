<?php

namespace FL\Assistant\Controllers\Cloud\Libraries;

use FL\Assistant\System\Contracts\ControllerAbstract;
use FL\Assistant\Helpers\CustomizerSettingHelper;

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
		$wp_customize = $this->init_customizer();

		$data = array(
			'mods' => array(),
			'options' => array(),
			'css' => '',
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

		// TODO: API to create item, return that response.
		return rest_ensure_response( [] );
	}

	public function import( $request ) {
		$item = $request->get_param( 'item' );

		if ( ! is_array( $item ) || empty( $item['data'] ) ) {
			return rest_ensure_response( [ 'error' => __( 'Missing item data.' ) ] );
		}

		$wp_customize = $this->init_customizer();
		do_action( 'customize_save', $wp_customize );

		foreach ( $item['data'] as $key => $value ) {
			if ( 'css' === $key && function_exists( 'wp_update_custom_css_post' ) ) {
				wp_update_custom_css_post( $value );
				continue;
			}
			foreach ( $value as $setting_key => $setting_value ) {
				$setting = new CustomizerSettingHelper( $wp_customize, $setting_key, array(
					'default'		=> '',
					'type'			=> 'mods' === $key ? 'theme_mod' : 'option',
					'capability'	=> 'edit_theme_options'
				) );
				do_action( 'customize_save_' . $setting_key, $wp_customize );
				$setting->import( $setting_value );
			}
		}

		do_action( 'customize_save_after', $wp_customize );

		// TODO: Figure out what response to send.
		return rest_ensure_response( [] );
	}

	/**
	 * Dynamically initialize the customizer. Inspired by the core
	 * function _wp_customize_publish_changeset.
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
