<?php

/**
 * REST API logic for posts.
 *
 * @since 0.1
 */
final class FL_Assistant_REST_Posts {

	/**
	 * Register routes.
	 *
	 * @since  0.1
	 * @return void
	 */
	static public function register_routes() {
		register_rest_route(
			FL_Assistant_REST::$namespace, '/posts', array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => __CLASS__ . '::posts',
					'permission_callback' => function() {
						return current_user_can( 'edit_published_posts' );
					},
				),
			)
		);

		register_rest_route(
			FL_Assistant_REST::$namespace, '/post/(?P<id>\d+)', array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => __CLASS__ . '::post',
					'permission_callback' => function() {
						return current_user_can( 'edit_published_posts' );
					},
				),
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => __CLASS__ . '::update_post',
					'permission_callback' => function() {
						return current_user_can( 'edit_published_posts' );
					},
				),
			)
		);
	}

	/**
	 * Returns an array of response data for a single post.
	 *
	 * @since  0.1
	 * @param object $post
	 * @return array
	 */
	static public function get_post_response_data( $post ) {
		$author = get_the_author_meta( 'display_name', $post->post_author );
		$date = get_the_date( '', $post );
		$response = array(
			'author'    => $author,
			'content'   => $post->post_content,
			'date'      => $date,
			'editUrl'   => get_edit_post_link( $post->ID, '' ),
			'id'        => $post->ID,
			'meta'      => $author . ' - ' . $date,
			'status'    => $post->post_status,
			'thumbnail' => get_the_post_thumbnail_url( $post, 'thumbnail' ),
			'title'     => empty( $post->post_title ) ? __( '(no title)', 'fl-assistant' ) : $post->post_title,
			'url'       => get_permalink( $post ),
		);

		if ( 'attachment' === $post->post_type ) {
			$size                  = wp_get_attachment_image_src( $post->ID, 'medium' );
			$response['urls']      = array(
				'medium' => $size[0],
			);
			$response['thumbnail'] = wp_get_attachment_image_src( $post->ID, 'thumbnail' )[0];
		}

		return $response;
	}

	/**
	 * Returns an array of posts and related data.
	 *
	 * @since  0.1
	 * @param object $request
	 * @return array
	 */
	static public function posts( $request ) {
		$response = array();
		$params   = $request->get_params();
		$posts    = get_posts(
			array_merge(
				$params, array(
					'perm' => 'editable',
				)
			)
		);

		foreach ( $posts as $post ) {
			$response[] = self::get_post_response_data( $post );
		}

		return rest_ensure_response( $response );
	}

	/**
	 * Returns data for a single post.
	 *
	 * @since  0.1
	 * @param object $request
	 * @return array
	 */
	static public function post( $request ) {
		$id       = $request->get_param( 'id' );
		$post     = get_post( $id );
		$response = self::get_post_response_data( $post );

		return rest_ensure_response( $response );
	}

	/**
	 * Updates data for a single post.
	 *
	 * @since  0.1
	 * @param object $request
	 * @return array
	 */
	static public function update_post( $request ) {
		$id       = $request->get_param( 'id' );
		$action   = $request->get_param( 'action' );

		switch ( $action ) {
			case 'trash':
				if ( ! EMPTY_TRASH_DAYS ) {
					wp_delete_post( $id );
				} else {
					wp_trash_post( $id );
				}
				break;
			case 'untrash':
				wp_untrash_post( $id );
				break;
		}

		return rest_ensure_response(
			array(
				'success' => true,
			)
		);
	}
}

FL_Assistant_REST_Posts::register_routes();
