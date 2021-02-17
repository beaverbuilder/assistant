<?php

namespace FL\Assistant\Helpers;

class PreviewHelper {

	/**
	 * Retrieve the preview url for a post.
	 *
	 * @param object $post
	 * @return string
	 */
	public static function get_post_preview_url( $post ) {
		$post = get_post( $post );
		$post_id = $post->ID;
		$post_type = $post->post_type;
		$var_name = 'page' === $post_type ? 'page_id' : 'p';

		return home_url( "/?post_type=$post_type&$var_name=$post_id&fl_asst_post_preview=1" );
	}
}
