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
					'methods'  => WP_REST_Server::READABLE,
					'callback' => __CLASS__ . '::comments',
				),
			)
		);

		register_rest_route(
			FL_Assistant_REST::$namespace, '/comment/(?P<id>\d+)', array(
				array(
					'methods'  => WP_REST_Server::READABLE,
					'callback' => __CLASS__ . '::comment',
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
		return array(
			'author'    => $comment->comment_author,
			'date'      => $comment->comment_date,
			'edit_url'  => get_edit_comment_link( $comment ),
			'thumbnail' => get_avatar_url( $comment->comment_author_email ),
			'title'     => $comment->comment_content,
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
		$response 	= array();
		$params   	= $request->get_params();
		$post_types = array( 'post_type' => array_keys( get_post_types() ) );
		$comments 	= get_comments( array_merge( $post_types, $params ) );

		foreach ( $comments as $comment ) {
			$response[] = self::get_comment_response_data( $comment );
		}

		return rest_ensure_response( $response );
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
}

FL_Assistant_REST_Comments::register_routes();
