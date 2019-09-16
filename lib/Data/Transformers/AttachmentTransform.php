<?php


namespace FL\Assistant\Data\Transformers;


class AttachmentTransform  {

	public function __invoke( \WP_Post $attachment ) {
		$size  = wp_get_attachment_image_src( $attachment->ID, 'medium' );
		$meta  = wp_prepare_attachment_for_js( $attachment->ID );
		$thumb = wp_get_attachment_image_src( $attachment->ID, 'thumbnail' )[0];

		return [
			'alt'             => $meta['title'],
			'author'          => get_the_author_meta( 'display_name', $attachment->post_author ),
			'commentsAllowed' => 'open' === $attachment->comment_status ? true : false,
			'date'            => get_the_date( '', $attachment ),
			'description'     => $meta['description'],
			'editUrl'         => get_edit_post_link( $attachment->ID, '' ),
			'filesize'        => $meta['filesizeHumanReadable'],
			'id'              => $attachment->ID,
			'mime'            => $meta['mime'],
			'sizes'           => isset( $meta['sizes'] ) ? $meta['sizes'] : [],
			'slug'            => $attachment->post_name,
			'subtype'         => $meta['subtype'],
			'thumbnail'       => $thumb,
			'title'           => $meta['title'],
			'type'            => $meta['type'],
			'url'             => get_permalink( $attachment ),
			'urls'            => [
				'medium' => $size[0],
			],
		];
	}

}
