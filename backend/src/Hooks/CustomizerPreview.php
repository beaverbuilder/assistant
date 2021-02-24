<?php

namespace FL\Assistant\Hooks;

class CustomizerPreview {

	public function __construct() {
		if ( ! isset( $_GET['fl-asst-customizer-preview'] ) ) {
			return;
		}

		add_action( 'customize_controls_print_styles', [ $this, 'print_styles' ] );
	}

	public function print_styles() {
		echo '<style>';
		echo '.wp-customizer .wp-full-overlay { margin: 0 !important; }';
		echo '.wp-customizer #customize-controls { display: none !important; }';
		echo '</style>';
	}
}
