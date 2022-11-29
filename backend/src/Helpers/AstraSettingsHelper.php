<?php

namespace FL\Assistant\Helpers;

class AstraSettingsHelper {

	/**
	 * @return array
	 */
	public static function export() {
		$settings = [];

		// Customizer settings
		if ( class_exists( '\Astra_Theme_Options' ) ) {
			$settings['customizer']['astra-settings'] = \Astra_Theme_Options::get_options();
		}

		// Global color palette
		if ( function_exists( 'astra_get_palette_colors' ) ) {
			$settings['customizer']['astra-color-palettes'] = astra_get_palette_colors();
		}

		// Typography presets
		if ( function_exists( 'astra_get_typography_presets' ) ) {
			$settings['customizer']['astra-typography-presets'] = astra_get_typography_presets();
		}

		// Astra addons
		if ( class_exists( '\Astra_Ext_Extension' ) ) {
			$settings['addons'] = \Astra_Ext_Extension::get_enabled_addons();
		}

		return $settings;
	}

	/**
	 * @param array $settings
	 * @return void
	 */
	public static function import( $settings ) {

		// Astra addons
		if ( class_exists( '\Astra_Admin_Helper' ) && isset( $settings['addons'] ) ) {
			\Astra_Admin_Helper::update_admin_settings_option( '_astra_ext_enabled_extensions', $settings['addons'] );
		}

		// Clear Astra's cache
		delete_option( 'astra-settings' );

		// Customizer settings
		if ( ! empty( $settings['customizer'] ) ) {
			foreach ( $settings['customizer'] as $option => $value ) {
				update_option( $option, $value );
			}
		}
	}
}
