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

        $post = get_post();
		$user = wp_get_current_user();

        return array(
            'api' => array(
                'root' => esc_url_raw( get_rest_url() ),
                'nonce' => wp_create_nonce( 'wp_rest' ),
            ),
            'page' => array(
                'ID' => $post->ID,
                'title' => $post->post_title,
                'type' => $post->post_type,
                'status' => $post->post_status,
                'slug' => $post->post_name,
            ),
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
}

FL_Assistant_Asset_Loader::init();
