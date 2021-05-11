<?php


namespace FL\Assistant\Data;


class Site {


	/**
	 * Get info about the current page view.
	 */
	public function get_current_view() {
		global $wp_the_query;

		$data    = [];
		$actions = [];
		$intro   = __( 'Currently Viewing', 'fl-assistant' );
		$type    = '';
		$name    = __( 'Untitled', 'fl-assistant' );

		$obj = get_queried_object();

		if ( is_admin() ) {

			$intro = __( 'Currently Viewing Admin Page', 'fl-assistant' );
			$type = __( 'Admin Page', 'fl-assistant' );
			$screen = get_current_screen();
			$name = $screen->id;

		} else {

			if ( is_404() ) {
				$name = __( 'Page Not Found', 'fl-assistant' );
				$type = __( '404', 'fl-assistant' );

			} elseif ( is_search() ) {

				$intro = __( 'Currently Viewing Search Results For', 'fl-assistant' );
				$type = __( 'Search Results For:', 'fl-assistant' );
				$name  = get_search_query();

			} elseif ( is_date() ) {

				$intro = __( 'Currently Viewing Date Archive', 'fl-assistant' );
				$type = __( 'Date Archive', 'fl-assistant' );
				$name  = get_the_date();

			} elseif ( is_post_type_archive() ) {

				$post_type = get_post_type_object( 'post' );
				$intro     = __( 'Currently Viewing Post Type Archive', 'fl-assistant' );
				$type = __( 'Post Type Archive', 'fl-assistant' );
				$name      = $post_type->labels->singular_name;

			} elseif ( is_tax() || is_category() || is_tag() ) {

				$tax    = get_taxonomy( $obj->taxonomy );
				$labels = $tax->labels;

				$intro = sprintf( esc_html__( 'Currently Viewing %s', 'fl-assistant' ), $labels->singular_name );
				$type = $labels->singular_name;
				$name  = $obj->name;

				$actions[] = [
					'handle'     => 'edit',
					'label'      => $labels->edit_item,
					'href'       => get_edit_term_link( $obj->term_id, $obj->taxonomy, null ),
					'capability' => 'manage_categories',
				];

			} elseif ( is_singular() || is_attachment() ) {

				$post_type = get_post_type_object( get_post_type() );
				$labels    = $post_type->labels;
				$post_type = $labels->singular_name;
				$intro     = sprintf( esc_html__( 'Currently Viewing %s', 'fl-assistant' ), $post_type );
				$type      = $post_type;
				$name      = $obj->post_title;

				$actions[] = [
					'handle'     => 'edit',
					'label'      => $labels->edit_item,
					'href'       => get_edit_post_link( $obj->ID, '' ),
					'target'     => '_blank',
					'rel'        => 'noopener',
					'capability' => 'edit_pages',
				];

				// Add Beaver Builder edit link
				if ( class_exists( '\FLBuilderModel' ) ) {
					if ( \FLBuilderModel::is_post_editable() && is_object( $wp_the_query->post ) ) {

						$enabled = get_post_meta( $wp_the_query->post->ID, '_fl_builder_enabled', true );

						$actions[] = [
							'handle'     => 'fl-builder',
							'label'      => \FLBuilderModel::get_branding(),
							'href'       => \FLBuilderModel::get_edit_url( $wp_the_query->post->ID ),
							'capability' => 'edit_pages',
							'isEnabled'  => $enabled,
						];
					}
				}
			} elseif ( is_author() ) {

				$intro = __( 'Currently Viewing Author', 'fl-assistant' );
				$type = __( 'Author Archive', 'fl-assistant' );
				$name  = wp_get_current_user()->display_name;

			} elseif ( is_front_page() ) {
				$intro = __( 'Currently Viewing Post Archive', 'fl-assistant' );
				$type = __( 'Post Archive', 'fl-assistant' );
				$name  = __( 'Latest Posts', 'fl-assistant' );
			}
		}

		$data['intro']   = $intro;
		$data['name']    = $name;
		$data['type']    = $type;

		$data['actions'] = $this->filter_actions_by_capability( $actions );

		$theme         = wp_get_theme();
		$data['theme'] = [
			'name'       => $theme->get( 'Name' ),
			'team'       => $theme->get( 'Author' ),
			'screenshot' => $theme->get_screenshot(),
			'version'    => $theme->get( 'Version' ),
		];

		$default_icon = plugins_url( 'img/icon-128x128.jpg', FL_ASSISTANT_FILE );
		$data['site'] = [
			'defaultIcon' => $default_icon,
			'icon'        => get_site_icon_url( 120, $default_icon ),
			'title'       => get_bloginfo( 'name' ),
			'description' => get_bloginfo( 'description' ),
			'homeURL'     => home_url(),
		];

		$data['isAdmin'] = is_admin();
		$data['is404'] = is_404();
		$data['isSearch'] = is_search();
		$data['isDate'] = is_date();
		$data['isPostTypeArchive'] = is_post_type_archive();
		$data['isSingular'] = is_singular();
		$data['isSingle'] = is_single();
		$data['isPage'] = is_page();
		$data['isAttachment'] = is_attachment();
		$data['isCategory'] = is_tax();
		$data['isCategory'] = is_category();
		$data['isTag'] = is_tag();
		$data['isAuthor'] = is_author();
		$data['isFrontPage'] = is_front_page();

		if ( is_singular() ) {
			$data['id'] = $obj->ID;
		}

		return $data;
	}

	/**
	 * Filter an array of actions by their capability
	 */
	public function filter_actions_by_capability( $actions = [], $exclude_unset = true ) {

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
	public function get_admin_urls() {
		$urls = [];

		$urls['dashboard'] = admin_url();

		$urls['createPost'] = admin_url( 'post-new.php' );
		$urls['editPost'] = admin_url( 'post.php?action=edit&post=' );
		$urls['customizeBase'] = admin_url( 'customize.php' );

		$url = static::get_customize_url();
		if ( $url ) {
			$urls['customize'] = $url;
		}

		if ( current_user_can( 'switch_themes' ) ) {
			$urls['switchThemes'] = admin_url( 'themes.php' );
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
	public function get_customize_url() {
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
			$customize_url = add_query_arg( [ 'changeset_uuid' => $wp_customize->changeset_uuid() ], $customize_url );
		}

		return $customize_url;
	}

	/**
	 * Check if the site is on localhost or not.
	 */
	public function is_local() {
		$ips = [ '127.0.0.1', '::1' ];
		$domain = '.local';
		if ( ! in_array( $_SERVER['REMOTE_ADDR'], $ips, true ) ) {
			return substr_compare( $_SERVER['SERVER_NAME'], $domain, -strlen( $domain ) ) === 0;
		}
		return true;
	}
}
