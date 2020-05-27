<?php

function fl_asst_admin_menu() {
    add_menu_page(
        __( 'Assistant', 'fl-assistant' ),
        __( 'Assistant', 'fl-assistant' ),
        'administrator',
        'fl_assistant', // Page slug
        'fl_asst_render_admin_screen' // Render func
    );
}
add_action( 'admin_menu', 'fl_asst_admin_menu' );

/**
 * Render function for the admin screen
 */
function fl_asst_render_admin_screen() {
    ?>
	<div id="fl-asst-admin-mount-node" class="fl-asst"></div>
	<?php
}

/**
 * Check if the current screen is the assistant admin screen
 */
function fl_asst_is_admin_screen() {
    global $current_screen;
    if ( ! $current_screen ) {
        return false;
    }
	return $current_screen->base === 'toplevel_page_fl_assistant';
}

/**
 * Filter body classes
 */
function fl_asst_admin_body_classes( $classes ) {

    if ( fl_asst_is_admin_screen() ) {
        $classes = "$classes fl-asst";
    }
    return $classes;
}
add_filter( 'admin_body_class', 'fl_asst_admin_body_classes' );

/**
 * Enqueue admin resources
 */
function fl_asst_admin_enqueue() {

    if ( fl_asst_is_admin_screen() ) {

        $url = FL_ASSISTANT_URL;
		$ver = FL_ASSISTANT_VERSION;

        // API - loaded in header
        $js_deps = ['fl-assistant-system'];

        // UI Render - loaded in footer
        wp_enqueue_style( 'fl-assistant-admin-render', $url . 'build/fl-assistant-admin-render.bundle.css', [], $ver, null );
        wp_enqueue_script( 'fl-assistant-admin-render', $url . 'build/fl-assistant-admin-render.bundle.js', $js_deps, $ver, true );
    }

}
add_action( 'admin_enqueue_scripts', 'fl_asst_admin_enqueue' );
