<?php


namespace FL\Assistant\Services\Entity;


use FL\Assistant\Util\HasEntityAttributes;

class Post {
	use HasEntityAttributes;

	public function hydrate(\WP_Post $post) {
		$author   = get_the_author_meta( 'display_name', $post->post_author );
		$date     = get_the_date( '', $post );
		$response = [
			'author'          => $author,
			'commentsAllowed' => 'open' === $post->comment_status ? true : false,
			'content'         => $post->post_content,
			'excerpt'         => $post->post_excerpt,
			'date'            => $date,
			'editUrl'         => get_edit_post_link( $post->ID, '' ),
			'id'              => $post->ID,
			'meta'            => $author . ' - ' . $date,
			'parent'          => $post->post_parent,
			'slug'            => $post->post_name,
			'status'          => $post->post_status,
			'thumbnail'       => get_the_post_thumbnail_url( $post, 'thumbnail' ),
			'title'           => empty( $post->post_title ) ? __( '(no title)', 'fl-assistant' ) : $post->post_title,
			'type'            => $post->post_type,
			'url'             => get_permalink( $post ),
			'visibility'      => __( 'Public', 'fl-assistant' ),
		];

		// Post visibility.
		if ( 'private' === $post->post_status ) {
			$response['visibility'] = __( 'Private', 'fl-assistant' );
		} elseif ( ! empty( $post->post_password ) ) {
			$response['visibility'] = __( 'Password Protected', 'fl-assistant' );
		}

		// Beaver Builder data.
//		if ( class_exists( '\FLBuilderModel' ) ) {
//
//			$response['bbCanEdit']   = $this->container()->service( 'site' )->bb_can_edit_post( $post->ID );
//			$response['bbIsEnabled'] = \FLBuilderModel::is_builder_enabled( $post->ID );
//			$response['bbBranding']  = \FLBuilderModel::get_branding();
//			$response['bbEditUrl']   = \FLBuilderModel::get_edit_url( $post->ID );
//		}

		return $response;
	}
}
