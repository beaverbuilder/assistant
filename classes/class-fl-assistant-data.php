<?php

/**
 * Handles working with backend assistant data.
 */
class FL_Assistant_Data {

	/**
	 * Default state for the current user.
	 */
	static public $default_user_state = array(
		'activeApp'          => 'fl-dashboard',
		'appFrameSize'       => 'normal',
		'appOrder'           => [],
		'isShowingUI'        => true,
		'panelPosition'      => 'end',
		'shouldReduceMotion' => false,
	);

	/**
	 * Returns an array of all assistant data.
	 *
	 * NOTE: Kept in alphabetical order.
	 */
	static public function get_all() {
		$user_state = self::get_current_user_state();

		/**
		 * This will hydrate the config object that can be
		 * accessed using the useConfig hook. If you need
		 * state, consider adding to the store instead.
		 */
		$config = array(
			'ajaxUrl'         => admin_url( 'admin-ajax.php' ),
			'apiRoot'         => esc_url_raw( get_rest_url() ),
			'contentTypes'    => self::get_post_types(),
			'contentStatus'   => self::get_post_stati(),
			'currentPageView' => self::get_current_view(),
			'currentUser'     => self::get_current_user_data(),
			'adminURLs'       => self::get_admin_urls(),
			'defaultAppName'  => 'fl-dashboard',
			'nonce'           => array(
				'api'             => wp_create_nonce( 'wp_rest' ),
				'reply'           => wp_create_nonce( 'replyto-comment' ),
				'replyUnfiltered' => wp_create_nonce( 'unfiltered-html-comment' ),
				'updates'         => wp_create_nonce( 'updates' ),
			),
			'pluginURL'       => FL_ASSISTANT_URL,
			'taxonomies'      => self::get_taxonomies(),
			'userRoles'       => self::get_user_roles(),
		);

		/**
		 * This will hydrate the redux store. Each key must
		 * have a reducer. If it doesn't need one, consider
		 * adding it to the config.
		 */
		$state = array(
			'activeApp'          => $user_state['activeApp'],
			'appFrameSize'       => $user_state['appFrameSize'],
			'appOrder'           => $user_state['appOrder'],
			'counts'             => self::get_counts(),
			'isShowingUI'        => $user_state['isShowingUI'],
			'panelPosition'      => $user_state['panelPosition'],
			'shouldReduceMotion' => $user_state['shouldReduceMotion'],
			'window'		 	 => $user_state['window'],
		);

		return array(
			'config' => $config,
			'state'  => $state,
		);
	}

	/**
	 * Get post type slugs and names.
	 */
	static public function get_post_types() {
		$data  = [];
		$types = get_post_types(
			array(
				'public' => true,
			), 'objects'
		);

		foreach ( $types as $slug => $type ) {
			if ( ! isset( $type->cap->edit_published_posts ) ) {
				continue;
			}
			if ( ! current_user_can( $type->cap->edit_published_posts ) ) {
				continue;
			}
			if ( 'attachment' === $slug ) {
				continue;
			}
			$data[ $slug ] = array(
				'canExport'      => $type->can_export,
				'hasArchive'     => $type->has_archive,
				'isHierarchical' => $type->hierarchical,
				'supports'       => array(
					'excerpt' => post_type_supports( $slug, 'excerpt' ),
				),
				'labels'         => array(
					'singular' => esc_html( $type->labels->singular_name ),
					'plural'   => esc_html( $type->labels->name ),
					'newItem'  => esc_html( $type->labels->new_item ),
					'editItem' => esc_html( $type->labels->edit_item ),
				),
			);
		}

		return $data;
	}

	/**
	 * Get post status slugs and names.
	 */
	static public function get_post_stati() {
		$data  = [];
		$stati = get_post_stati( array(), 'objects' );

		foreach ( $stati as $slug => $status ) {
			$data[ $slug ] = esc_html( $status->label );
		}

		return $data;
	}

	/**
	 * Checks to see if Beaver Builder can be used
	 * to edit a post.
	 */
	static public function bb_can_edit_post( $post_id ) {
		$editable    = false;
		$post        = get_post( $post_id );
		$post_types  = FLBuilderModel::get_post_types();
		$user_can    = current_user_can( 'edit_post', $post->ID );
		$user_access = FLBuilderUserAccess::current_user_can( 'builder_access' );

		if ( in_array( $post->post_type, $post_types, true ) && $user_can && $user_access ) {
			$editable = true;
		}

		return (bool) apply_filters( 'fl_builder_is_post_editable', $editable );
	}

	/**
	 * Get taxonomy slugs and names.
	 */
	static public function get_taxonomies() {
		$data  = [];
		$types = self::get_post_types();

		foreach ( $types as $type_slug => $type ) {
			$taxonomies = get_object_taxonomies( $type_slug, 'objects' );
			foreach ( $taxonomies as $taxonomy_slug => $taxonomy ) {
				if ( ! $taxonomy->public || ! $taxonomy->show_ui || 'post_format' === $taxonomy_slug ) {
					continue;
				}
				$data[ $taxonomy_slug ] = array(
					'description'    => $taxonomy->description,
					'isHierarchical' => $taxonomy->hierarchical,
					'labels'         => array(
						'singular'   => esc_html( $taxonomy->labels->singular_name ),
						'plural'     => esc_html( $taxonomy->labels->name ),
						'newItem'    => sprintf( esc_html_x( 'New %s', 'Singular term name.', 'fl-assistant' ), $taxonomy->labels->singular_name ),
						'addNewItem' => esc_html( $taxonomy->labels->add_new_item ),
						'editItem'   => esc_html( $taxonomy->labels->edit_item ),
					),
				);
			}
		}

		return $data;
	}

	/**
	 * Get info about the current page view.
	 */
	static public function get_current_view() {
		$data    = [];
		$actions = [];
		$intro   = __( 'Currently Viewing', 'fl-assistant' );
		$name    = __( 'Untitled', 'fl-assistant' );

		$obj                    = get_queried_object();
		$data['queried_object'] = $obj;

		if ( is_404() ) {
			$name = __( 'Page Not Found (404)', 'fl-assistant' );

		} elseif ( is_search() ) {

			$intro = __( 'Currently Viewing Search Results For', 'fl-assistant' );
			$name  = get_search_query();

		} elseif ( is_date() ) {

			$intro = __( 'Currently Viewing Date Archive', 'fl-assistant' );
			$name = get_the_date();

		} elseif ( is_post_type_archive() ) {

			$post_type = get_post_type_object( 'post' );
			$intro     = __( 'Currently Viewing Post Type Archive', 'fl-assistant' );
			$name      = $post_type->labels->singular_name;

		} elseif ( is_tax() || is_category() || is_tag() ) {

			$tax    = get_taxonomy( $obj->taxonomy );
			$labels = $tax->labels;

			$intro = sprintf( esc_html__( 'Currently Viewing %s', 'fl-assistant' ), $labels->singular_name );
			$name  = $obj->name;

			$actions[] = [
				'label'      => $labels->edit_item,
				'href'       => get_edit_term_link( $obj->term_id, $obj->taxonomy, null ),
				'capability' => 'manage_categories',
			];

		} elseif ( is_singular() || is_attachment() ) {

			$post_type = get_post_type_object( get_post_type() );
			$labels    = $post_type->labels;
			$post_type = $labels->singular_name;
			$intro     = sprintf( esc_html__( 'Currently Viewing %s', 'fl-assistant' ), $post_type );
			$name      = $obj->post_title;

			if ( is_attachment() ) {
				$meta = wp_get_attachment_metadata( $obj->ID );
				$name = basename( $meta['file'] );
			}

			$actions[] = [
				'label'      => $labels->edit_item,
				'href'       => get_edit_post_link( $obj->ID, '' ),
				'capability' => 'edit_pages',
			];

			// Add Beaver Builder edit link
			global $wp_the_query;
			if ( class_exists( 'FLBuilderModel' ) ) {
				if ( FLBuilderModel::is_post_editable() && is_object( $wp_the_query->post ) ) {

					$enabled = get_post_meta( $wp_the_query->post->ID, '_fl_builder_enabled', true );

					$actions[] = [
						'label'      => FLBuilderModel::get_branding(),
						'href'       => FLBuilderModel::get_edit_url( $wp_the_query->post->ID ),
						'capability' => 'edit_pages',
						'isEnabled'  => $enabled,
					];
				}
			}
		} elseif ( is_author() ) {

			$intro = __( 'Currently Viewing Author', 'fl-assistant' );
			$name  = wp_get_current_user()->display_name;

		} elseif ( is_front_page() ) {
			$intro = __( 'Currently Viewing Post Archive', 'fl-assistant' );
			$name = __( 'Latest Posts', 'fl-assistant' );
		}

		$data['intro']   = $intro;
		$data['name']    = $name;
		$data['actions'] = self::filter_actions_by_capability( $actions );

		$theme         = wp_get_theme();
		$data['theme'] = [
			'name'       => $theme->get( 'Name' ),
			'team'       => $theme->get( 'Author' ),
			'screenshot' => $theme->get_screenshot(),
			'version'    => $theme->get( 'Version' ),
		];

		return $data;
	}

	/**
	 * Filter an array of actions by their capability
	 */
	static public function filter_actions_by_capability( $actions = [], $exclude_unset = true ) {

		foreach ( $actions as $i => $action ) {
			$defaults = [
				'label'      => '',
				'capability' => '',
			];
			$action   = wp_parse_args( $action, $defaults );
			$cap      = $action['capability'];

			// Remove actions without a capability set
			if ( $exclude_unset && ( '' === $cap || empty( $cap ) ) ) {
				unset( $actions[ $i ] );
			}
			// Test capability
			if ( is_string( $cap ) && ! current_user_can( $cap ) ) {
				unset( $actions[ $i ] );
			}

			// Test array of capabilities
			if ( is_array( $cap ) ) {
				foreach ( $cap as $single_cap ) {
					if ( ! current_user_can( $single_cap ) ) {
						unset( $actions[ $i ] );
					}
				}
			}
		}

		return $actions;
	}

	/**
	 * Get an action set for allowed admin links.
	 */
	static public function get_admin_urls() {
		$urls = [];

		$urls['createPost'] = admin_url( 'post-new.php' );

		$url = self::get_customize_url();
		if ( $url ) {
			$urls['customize'] = $url;
		}

		if ( current_user_can( 'switch_themes' ) ) {
			$urls['switchThemes'] = '';
		}

		// Your User Profile
		$user_id = get_current_user_id();
		if ( current_user_can( 'read' ) ) {
			$urls['userProfile'] = get_edit_profile_url( $user_id );
		}

		if ( current_user_can( 'create_users' ) ) {
			$urls['createUser'] = admin_url( 'user-new.php' );
		}

		return $urls;
	}

	/**
	 * Get customize url
	 */
	static public function get_customize_url() {
		global $wp_customize;

		// Don't show for users who can't access the customizer or when in the admin.
		if ( ! current_user_can( 'customize' ) || is_admin() ) {
			return;
		}

		// Don't show if the user cannot edit a given customize_changeset post currently being previewed.
		if ( is_customize_preview() && $wp_customize->changeset_post_id() && ! current_user_can( get_post_type_object( 'customize_changeset' )->cap->edit_post, $wp_customize->changeset_post_id() ) ) {
			return;
		}

		$current_url = ( is_ssl() ? 'https://' : 'http://' ) . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
		if ( is_customize_preview() && $wp_customize->changeset_uuid() ) {
			$current_url = remove_query_arg( 'customize_changeset_uuid', $current_url );
		}

		$customize_url = add_query_arg( 'url', urlencode( $current_url ), wp_customize_url() );
		if ( is_customize_preview() ) {
			$customize_url = add_query_arg( array( 'changeset_uuid' => $wp_customize->changeset_uuid() ), $customize_url );
		}
		return $customize_url;
	}

	/**
	 * Get the saved state for a user.
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
	 */
	static public function get_current_user_state() {
		return self::get_user_state( wp_get_current_user()->ID );
	}

	/**
	 * Get info about the current user.
	 */
	static public function get_current_user_data() {
		$user = wp_get_current_user();
		$request = new WP_REST_Request( 'GET', '/fl-assistant/v1/user/' . $user->ID );
		$response = rest_do_request( $request );

		return array_merge(
			$response->get_data(),
			array(
				'capabilities' => $user->allcaps,
			)
		);
	}

	/**
	 * Get all user roles for the site.
	 */
	static public function get_user_roles() {
		if ( ! function_exists( 'get_editable_roles' ) ) {
			require_once( ABSPATH . 'wp-admin/includes/user.php' );
		}

		$data  = [];
		$roles = get_editable_roles();

		foreach ( $roles as $key => $role ) {
			$data[] = [
				'key'  => $key,
				'name' => $role['name'],
			];
		}

		return $data;
	}

	/**
	 * Returns an array of all counts to hydrate the store.
	 */
	static public function get_counts() {
		$request = new WP_REST_Request( 'GET', '/fl-assistant/v1/counts' );
		$response = rest_do_request( $request );
		return $response->get_data();
	}
}
