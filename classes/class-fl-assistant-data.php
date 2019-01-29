<?php

/**
 * Handles working with backend assistant data.
 *
 * @since 0.1
 */
class FL_Assistant_Data {

	/**
	 * Default state for the current user.
	 *
	 * @since 0.1
	 * @var string $default_user_state
	 */
	static public $default_user_state = array(
		'activeApp' => 'fl-dashboard',
		'showUI'    => true,
	);

	/**
	 * Returns an array of all assistant data.
	 *
	 * NOTE: Kept in alphabetical order.
	 *
	 * @since 0.1
	 * @return array
	 */
	static public function get_all() {
		$user_state = self::get_current_user_state();

		return array(
			'activeApp'       => $user_state['activeApp'],
			'apiNonce'        => wp_create_nonce( 'wp_rest' ),
			'apiRoot'         => esc_url_raw( get_rest_url() ),
			'currentPageView' => self::get_current_view(),
			'contentTypes'    => self::get_post_types(),
			'currentUser'     => self::get_current_user_data(),
			'pluginURL'       => FL_ASSISTANT_URL,
			'showUI'          => $user_state['showUI'],
		);
	}

	/**
	 * Get post type slugs and names.
	 *
	 * @since 0.1
	 * @return array
	 */
	static public function get_post_types() {
		$data  = [];
		$types = get_post_types(
			array(
				'public' => true,
			), 'objects'
		);

		foreach ( $types as $slug => $type ) {
			if ( 'attachment' === $slug ) {
				continue;
			}
			$data[ $slug ] = esc_html( $type->labels->name );
		}

		return $data;
	}

	/**
	 * Get info about the current page view.
	 *
	 * @since 0.1
	 * @return array
	 */
	static public function get_current_view() {
		$data  = [];
		$intro = __( 'Currently Viewing', 'fl-assistant' );
		$name  = __( 'Untitled', 'fl-assistant' );

		if ( is_embed() ) {

			$intro = __( 'Currently Viewing Embed', 'fl-assistant' );
			$name  = get_the_title();

		} elseif ( is_404() ) {

			$name = __( 'Page Not Found', 'fl-assistant' );

		} elseif ( is_search() ) {

			$intro = __( 'Currently Viewing Search Results For', 'fl-assistant' );
			$name  = get_search_query();

		} elseif ( is_front_page() ) {

			$intro = __( 'Currently Viewing Front Page', 'fl-assistant' );
			$name  = get_the_title();

		} elseif ( is_post_type_archive() ) {

			$intro = __( 'Currently Viewing Post Type Archive', 'fl-assistant' );
			$name  = get_the_archive_title();

		} elseif ( is_tax() ) {

			$intro = __( 'Currently Viewing Taxonomy', 'fl-assistant' );
			$name  = get_the_title();

		} elseif ( is_category() ) {

			$intro = __( 'Currently Viewing Category', 'fl-assistant' );
			$name  = get_cat_name();

		} elseif ( is_tag() ) {

			$intro = __( 'Currently Viewing Tag', 'fl-assistant' );
			$name  = get_tag_name();

		} elseif ( is_attachment() ) {

			$intro = __( 'Currently Viewing Attachment', 'fl-assistant' );
			$name  = get_the_title();

		} elseif ( is_singular() ) {
			$post_type = get_post_type_object( get_post_type() )->labels->singular_name;
			/* translators: post type singular name. */
			$intro = sprintf( esc_html__( 'Currently Viewing %s', 'fl-assistant' ), $post_type );
			$name  = get_the_title();
		} elseif ( is_author() ) {
			$intro = __( 'Currently Viewing Author', 'fl-assistant' );
			$name  = wp_get_current_user()->display_name;
		}

		$data['intro'] = $intro;
		$data['name']  = $name;

		return $data;
	}

	/**
	 * Get the saved state for a user.
	 *
	 * @since 0.1
	 * @param int $id
	 * @return array
	 */
	static public function get_user_state( $id ) {
		$saved = get_user_meta( $id, 'fl_assistant_state', true );

		return array_merge(
			self::$default_user_state,
			$saved ? (array) $saved : array()
		);
	}

	/**
	 * Update the saved state for a user.
	 *
	 * @since 0.1
	 * @param int $id
	 * @param array $state
	 * @return void
	 */
	static public function update_user_state( $id, $state ) {
		$saved = self::get_user_state( $id );

		update_user_meta(
			$id, 'fl_assistant_state', array_merge(
				$saved,
				$state ? (array) $state : array()
			)
		);
	}

	/**
	 * Get the saved state for the current user.
	 *
	 * @since 0.1
	 * @return array
	 */
	static public function get_current_user_state() {
		return self::get_user_state( wp_get_current_user()->ID );
	}

	/**
	 * Get info about the current user.
	 *
	 * @since 0.1
	 * @return array
	 */
	static public function get_current_user_data() {
		$user = wp_get_current_user();

		return array(
			'id'   => $user->ID,
			'name' => $user->display_name,
		);
	}
}
