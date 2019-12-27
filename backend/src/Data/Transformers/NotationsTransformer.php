<?php

namespace FL\Assistant\Data\Transformers;

use FL\Assistant\System\Contracts\TransformerAbstract;

class NotationsTransformer extends TransformerAbstract {

	public function __invoke( \WP_Post $post ) {
		$meta = get_post_custom( $post->ID );
		$type = $meta['fl_asst_notation_type'][0];
		$notation = [
			'id'          => $post->ID,
			'type'        => $type,
			'object_type' => $meta['fl_asst_notation_object_type'][0],
			'object_id'   => $meta['fl_asst_notation_object_id'][0],
		];

		if ( 'favorite' === $type ) {
			return $this->transform_favorite( $post, $notation );
		} elseif ( 'label' === $type ) {
			return $this->transform_label( $post, $notation );
		}

		return $notation;
	}

	public function transform_favorite( \WP_Post $post, $notation ) {
		return array_merge(
			$notation, [
				'user_id' => $post->post_author,
			]
		);
	}

	public function transform_label( \WP_Post $post, $notation ) {
		return array_merge(
			$notation, [
				'label_id' => (int) get_post_meta( $post->ID, 'fl_asst_notation_label_id', true ),
			]
		);
	}
}
