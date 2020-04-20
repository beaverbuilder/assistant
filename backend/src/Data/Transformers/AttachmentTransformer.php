<?php


namespace FL\Assistant\Data\Transformers;

use FL\Assistant\Data\Repository\NotationsRepository;


class AttachmentTransformer {

	protected $notations;

	public function __construct(
		NotationsRepository $notations
	) {
		$this->notations = $notations;
	}

	public function __invoke( \WP_Post $attachment ) {
		$size      = wp_get_attachment_image_src( $attachment->ID, 'medium' );
		$meta      = wp_prepare_attachment_for_js( $attachment->ID );
		$thumb_src = wp_get_attachment_image_src( $attachment->ID, 'thumbnail' );
		$thumb     = $thumb_src ? $thumb_src[0] : null;

		$response = [
			'alt'             => $meta['alt'],
			'author'          => get_the_author_meta( 'display_name', $attachment->post_author ),
			'commentsAllowed' => 'open' === $attachment->comment_status ? true : false,
			'date'            => get_the_date( '', $attachment ),
			'description'     => $meta['description'],
			'editUrl'         => get_edit_post_link( $attachment->ID, '' ),
			'filesize'        => $meta['filesizeHumanReadable'],
			'filename'        => $meta['filename'],
			'id'              => $attachment->ID,
			'labels'          => [],
			'mime'            => $meta['mime'],
			'permalink'       => get_permalink( $attachment ),
			'sizes'           => isset( $meta['sizes'] ) ? $meta['sizes'] : [],
			'slug'            => $attachment->post_name,
			'subtype'         => $meta['subtype'],
			'thumbnail'       => $thumb,
			'title'           => $meta['title'],
			'type'            => $meta['type'],
			'url'             => $meta['url'],
			'urls'            => [
				'medium' => $size ? $size[0] : null,
			],
			'height'          => $meta['height'],
			'width'           => $meta['width'],
			'orientation'     => isset( $meta['orientation'] ) ? $meta['orientation'] : null,
		];

		// Labels
		$labels = $this->notations->get_labels( 'attachment', $attachment->ID );
		foreach ( $labels as $label ) {
			$response['labels'][] = $label['label_id'];
		}

		return $response;
	}

}
