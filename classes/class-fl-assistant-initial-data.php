<?php

/**
 * Handles loading the initial frontend data.
 *
 * @since 0.1
 */
class FL_Assistant_Initial_Data {

    /**
     * Setup the data structure for sending to js on page lowad.
     *
     * @since 0.1
     * @return Array
     */
    static public function get() {
		$user = wp_get_current_user();

		// TODO: What is initial state vs config? Need to sort this out better.
        return array(

			// TODO: Pull from user meta.
			'activeApp' => 'fl-dashboard',
			'showUI' => true,

            'api' => array(
                'root' => esc_url_raw( get_rest_url() ),
                'nonce' => wp_create_nonce( 'wp_rest' ),
                'plugin_url' => FL_ASSISTANT_URL,
            ),
            'current_page_view' => self::get_current_view(),
			'site' => array(
	            'types' => self::get_post_types(),
			),
			'user' => array(
				'name' => $user->display_name,
			),
        );
    }

    /**
     * Get post type slugs and names.
     *
     * @since 0.1
     * @return Array
     */
    static public function get_post_types() {
        $data = [];
        $types = get_post_types( array(
            'public' => true,
        ), 'objects' );

        foreach ( $types as $slug => $type ) {
			if ( 'attachment' === $slug ) {
				continue;
			}
            $data[ $slug ] = esc_html( $type->labels->name );
        }

        return $data;
    }

    /**
     * Get info about the current page view
     * @since 0.1
     * @return Array
     */
    static public function get_current_view() {
        $data = [];
        $intro = __('Currently Viewing', 'fl-assistant');
        $name = __('Untitled', 'fl-assistant');

        if ( is_embed() ) {

            $intro = __('Currently Viewing Embed', 'fl-assistant');
            $name = get_the_title();

        } elseif ( is_404() ) {

            $name = __('Page Not Found', 'fl-assistant');

        } elseif ( is_search() ) {

            $intro = __('Currently Viewing Search Results For', 'fl-assistant');
            $name = get_search_query();

        } elseif ( is_front_page() ) {

            $intro = __('Currently Viewing Front Page', 'fl-assistant');
            $name = get_the_title();

        } elseif ( is_post_type_archive() ) {

            $intro = __('Currently Viewing Post Type Archive', 'fl-assistant');
            $name = get_the_archive_title();

        } elseif ( is_tax() ) {

            $intro = __('Currently Viewing Taxonomy', 'fl-assistant');
            $name = get_the_title();

        } elseif ( is_category() ) {

            $intro = __('Currently Viewing Category', 'fl-assistant');
            $name = get_cat_name();

        } elseif ( is_tag() ) {

            $intro = __('Currently Viewing Tag', 'fl-assistant');
            $name = get_tag_name();

        } elseif ( is_attachment() ) {

            $intro = __('Currently Viewing Attachment', 'fl-assistant');
            $name = get_the_title();

        } elseif ( is_singular() ) {
            $post_type = get_post_type_object(get_post_type())->labels->singular_name;
            $intro = sprintf( esc_html__('Currently Viewing %s', 'fl-assistant'), $post_type );
            $name = get_the_title();
        } elseif ( is_author() ) {
            $intro = __('Currently Viewing Author', 'fl-assistant');
            $name = wp_get_current_user()->display_name;
        }

        $data['intro'] = $intro;
        $data['name'] = $name;

        return $data;
    }
}
