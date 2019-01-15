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
					'methods'  => WP_REST_Server::READABLE,
					'callback' => __CLASS__ . '::posts',
				),
			)
		);
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
		$post_type = $request->get_param( 'type' );
		$search = $request->get_param( 'search' );

		$posts = get_posts( array(
			'post_type' => $post_type ? $post_type : 'post',
			'numberposts' => -1,
			'orderby' => 'title',
			'order' => 'ASC',
			's' => $search ? $search : '',
		) );

		foreach ( $posts as $post ) {
			$response[] = array(
				'author' => get_the_author_meta( 'display_name', $post->post_author ),
				'date' => get_the_date( '', $post ),
				'edit_url' => get_edit_post_link( $post->ID, '' ),
				'thumbnail' => get_the_post_thumbnail_url( $post, 'thumbnail' ),
				'title' => ! empty( $post->post_title ) ? $post->post_title : $post->post_name,
				'url' => get_permalink( $post ),
			);
		}

		return rest_ensure_response( $response );
	}
}

FL_Assistant_REST_Posts::register_routes();
