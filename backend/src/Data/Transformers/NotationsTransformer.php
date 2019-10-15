<?php


namespace FL\Assistant\Data\Transformers;

use FL\Assistant\System\Contracts\TransformerAbstract;

class NotationsTransformer extends TransformerAbstract {

	public function __invoke( \WP_Post $post ) {
		$type = get_post_meta( $post->ID, 'fl_asst_notation_type', true );
		$notation = [
			'id' => $post->ID,
			'type' => $type,
		];

		if ( 'favorite' === $type ) {
			return $this->transform_favorite( $post, $notation );
		} else if ( 'label' === $type ) {
			return $this->transform_label( $post, $notation );
		}

		return $notation;
	}

	public function transform_favorite( \WP_Post $post, $notation ) {
		return array_merge( $notation, [
			'user_id' => $post->post_author,
		] );
	}

	public function transform_label( \WP_Post $post, $notation ) {
		return array_merge( $notation, [
			'label_id' => (int) get_post_meta( $post->ID, 'fl_asst_notation_label_id', true ),
		] );
	}
}
