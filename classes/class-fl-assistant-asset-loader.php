<?php

/**
 * Handles enqueuing css and js assets for the UI
 * in addition to setup of the initial frontend data.
 *
 * @since 0.1
 */
class FL_Assistant_Asset_Loader {

    /**
     * Initialize the backend application.
     *
     * @since 0.1
     * @return void
     */
    static public function init() {
        add_action( 'wp_enqueue_scripts', __CLASS__ . '::enqueue' );
    }

    /**
     * Enqueue frontend resources - fired on wp_enqueue_scripts action.
     *
     * @since 0.1
     * @return void
     */
    static public function enqueue() {

        if ( self::should_enqueue() ) {
            wp_enqueue_script( 'fl-assistant-utils', FL_ASSISTANT_URL . 'build/utils.bundle.js', array(), FL_ASSISTANT_VERSION, true );

            wp_enqueue_script( 'fl-assistant-front', FL_ASSISTANT_URL . 'build/front.bundle.js', array(), FL_ASSISTANT_VERSION, true );
            wp_enqueue_style( 'fl-assistant-front', FL_ASSISTANT_URL . 'build/front.bundle.css', array(), FL_ASSISTANT_VERSION, null );

            wp_localize_script( 'fl-assistant-front', 'FLAssistantInitialData', self::initial_data() );
        }
    }

    /**
     * Check if the frontend scripts/styles should be enqueued
     *
     * @since 0.1
     * @return Bool
     */
    static public function should_enqueue() {

        $should_enqueue = true;

        if ( ! is_user_logged_in() || is_customize_preview() ) {
            $should_enqueue = false;
        }

        // If Beaver Builder is active, don't enqueue
        if ( class_exists( 'FLBuilderModel' ) ) {
            if ( FLBuilderModel::is_builder_active() || FLBuilderModel::is_builder_draft_preview() ) {
                $should_enqueue = false;
            }
        }
        return $should_enqueue;
    }

    /**
     * Setup the data structure for sending to js on page load.
     *
     * @since 0.1
     * @return Array
     */
    static public function initial_data() {
		$user = wp_get_current_user();

        return array(
            'api' => array(
                'root' => esc_url_raw( get_rest_url() ),
                'nonce' => wp_create_nonce( 'wp_rest' ),
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
        }

        /* JUST FOR REFERENCE - wp-includes/template-loader.php
        $template = false;
    	if     ( is_embed()          && $template = get_embed_template()          ) :
    	elseif ( is_404()            && $template = get_404_template()            ) :
    	elseif ( is_search()         && $template = get_search_template()         ) :
    	elseif ( is_front_page()     && $template = get_front_page_template()     ) :
    	elseif ( is_home()           && $template = get_home_template()           ) :
    	elseif ( is_post_type_archive() && $template = get_post_type_archive_template() ) :
    	elseif ( is_tax()            && $template = get_taxonomy_template()       ) :
    	elseif ( is_attachment()     && $template = get_attachment_template()     ) :
    		remove_filter('the_content', 'prepend_attachment');
    	elseif ( is_single()         && $template = get_single_template()         ) :
    	elseif ( is_page()           && $template = get_page_template()           ) :
    	elseif ( is_singular()       && $template = get_singular_template()       ) :
    	elseif ( is_category()       && $template = get_category_template()       ) :
    	elseif ( is_tag()            && $template = get_tag_template()            ) :
    	elseif ( is_author()         && $template = get_author_template()         ) :
    	elseif ( is_date()           && $template = get_date_template()           ) :
    	elseif ( is_archive()        && $template = get_archive_template()        ) :
    	else :
    		$template = get_index_template();
    	endif;
        */

        $data['intro'] = $intro;
        $data['name'] = $name;

        return $data;
    }
}

FL_Assistant_Asset_Loader::init();
