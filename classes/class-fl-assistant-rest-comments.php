<?php

/**
 * REST API logic for comments.
 *
 * @since 0.1
 */
final class FL_Assistant_REST_Comments {

	/**
	 * Register routes.
	 *
	 * @since  0.1
	 * @return void
	 */
	static public function register_routes() {
		register_rest_route(
			FL_Assistant_REST::$namespace, '/comments', array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => __CLASS__ . '::comments',
					'permission_callback' => function() {
						return current_user_can( 'moderate_comments' );
					},
				),
			)
		);

		register_rest_route(
			FL_Assistant_REST::$namespace, '/comments/count', array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => __CLASS__ . '::comments_count',
					'permission_callback' => function() {
						return current_user_can( 'moderate_comments' );
					},
				),
			)
		);

		register_rest_route(
			FL_Assistant_REST::$namespace, '/comment/(?P<id>\d+)', array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => __CLASS__ . '::comment',
					'permission_callback' => function() {
						return current_user_can( 'moderate_comments' );
					},
				),
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => __CLASS__ . '::update_comment',
					'permission_callback' => function() {
						return current_user_can( 'moderate_comments' );
					},
				),
			)
		);
	}

	/**
	 * Returns an array of response data for a single comment.
	 *
	 * @since  0.1
	 * @param object $comment
	 * @return array
	 */
	static public function get_comment_response_data( $comment ) {
		$post = get_post( $comment->comment_post_ID );
		$date = mysql2date( get_option( 'date_format' ), $comment->comment_date );
		return array(
			'approved'  => $comment->comment_approved ? true : false,
			'author'    => $comment->comment_author,
			'content'   => $comment->comment_content,
			'date'      => $date,
			'editUrl'   => admin_url( 'comment.php?action=editcomment&c=' ) . $comment->comment_ID,
			'id'        => $comment->comment_ID,
			'meta'      => $comment->comment_author . ' - ' . $date,
			'postTitle' => $post->post_title,
			'spam'      => 'spam' === $comment->comment_approved,
			'thumbnail' => get_avatar_url( $comment->comment_author_email ),
			'title'     => strip_tags( $comment->comment_content ),
			'trash'     => 'trash' === $comment->comment_approved,
			'url'       => get_comment_link( $comment ),
		);
	}

	/**
	 * Returns an array of comments and related data.
	 *
	 * @since  0.1
	 * @param object $request
	 * @return array
	 */
	static public function comments( $request ) {
		$response   = array();
		$params     = $request->get_params();
		$post_types = array_keys( get_post_types() );
		$comments   = get_comments( array_merge( array( 'post_type' => $post_types ), $params ) );

		foreach ( $comments as $comment ) {
			$response[] = self::get_comment_response_data( $comment );
		}

		return rest_ensure_response( $response );
	}

	/**
	 * Returns the number of comments found given
	 * the current args.
	 *
	 * @since  0.1
	 * @param object $request
	 * @return array
	 */
	static public function comments_count( $request ) {
		$counts = wp_count_comments();
		return rest_ensure_response(
			array(
				'approved' => $counts->approved,
				'pending'  => $counts->moderated,
				'spam'     => $counts->spam,
				'trash'    => $counts->trash,
				'total'    => $counts->total_comments,
			)
		);
	}

	/**
	 * Returns data for a single comment.
	 *
	 * @since  0.1
	 * @param object $request
	 * @return array
	 */
	static public function comment( $request ) {
		$id       = $request->get_param( 'id' );
		$comment  = get_comment( $id );
		$response = self::get_comment_response_data( $comment );

		return rest_ensure_response( $response );
	}

	/**
	 * Updates data for a single comment.
	 *
	 * @since  0.1
	 * @param object $request
	 * @return array
	 */
	static public function update_comment( $request ) {
		$id       = $request->get_param( 'id' );
		$action   = $request->get_param( 'action' );
		$comment  = get_comment( $id );

		switch ( $action ) {
			case 'approve':
				wp_set_comment_status( $comment, 'approve' );
				break;
			case 'unapprove':
				wp_set_comment_status( $comment, 'hold' );
				break;
			case 'spam':
				wp_spam_comment( $comment );
				break;
			case 'unspam':
				wp_unspam_comment( $comment );
				break;
			case 'trash':
				if ( ! EMPTY_TRASH_DAYS ) {
					wp_delete_comment( $comment );
				} else {
					wp_trash_comment( $comment );
				}
				break;
			case 'untrash':
				wp_untrash_comment( $comment );
				break;
		}

		return rest_ensure_response(
			array(
				'success' => true,
			)
		);
	}
}

FL_Assistant_REST_Comments::register_routes();
