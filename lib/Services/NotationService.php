<?php

namespace FL\Assistant\Services;

use FL\Assistant\Util\HasContainer;

class NotationService {

	use HasContainer;

	/**
	 * Get array of notations with the corresponding meta values.
	 * @return array
	 */
	public function get_by_meta( $meta ) {
		$meta_query = [];

		foreach ( $meta as $key => $value ) {
			$meta_query[] = [
				'key' => $key,
				'value' => $value,
				'compare' => '=',
			];
		}

		$query = new \WP_Query( [
			'post_type' => 'fl_asst_notation',
			'meta_query' => $meta_query,
		] );

		return $query->posts;
	}

	/**
	 * Get array of notations with the corresponding meta values.
	 * @return array
	 */
	public function get_favorites( $object_type, $object_id, $user_id ) {
		return $this->get_by_meta( [
			'fl_asst_notation_type' => 'favorite',
			'fl_asst_notation_object_type' => $object_type,
			'fl_asst_notation_object_id' => (int) $object_id,
			'fl_asst_notation_user_id' => (int) $user_id,
		] );
	}
}
