<?php

namespace FL\Assistant\Data\Repository;

use FL\Assistant\Data\Transformers\NotationsTransformer;

class NotationsRepository {

	protected $transformer;

	public function __construct( NotationsTransformer $transformer ) {
		$this->transformer = $transformer;
	}

	/**
	 * @param array $args
	 *
	 * @return \WP_Query
	 */
	public function query( array $args = [] ) {
		$args = array_merge(
			$args, [
				'post_type' => 'fl_asst_notation',
			]
		);

		$query = new \WP_Query( $args );
		return $this->transformer->transform_array( $query->posts );
	}

	/**
	 * Get array of notations with the corresponding meta values.
	 * @return array
	 */
	public function get_by_meta( $meta ) {
		$meta_query = [];

		foreach ( $meta as $key => $value ) {
			$meta_query[] = [
				'key'     => $key,
				'value'   => $value,
				'compare' => '=',
			];
		}

		$query = new \WP_Query(
			[
				'post_type'  => 'fl_asst_notation',
				'meta_query' => $meta_query,
			]
		);

		return $this->transformer->transform_array( $query->posts );
	}

	/**
	 * Get an array of notations for the given object.
	 * @return array
	 */
	public function get_notations( $object_type, $object_id ) {
		return $this->get_by_meta(
			[
				'fl_asst_notation_object_type' => $object_type,
				'fl_asst_notation_object_id'   => (int) $object_id,
			]
		);
	}

	/**
	 * Get an array of favorites for the given object.
	 * @return array
	 */
	public function get_favorites( $object_type, $object_id, $user_id ) {
		return $this->get_by_meta(
			[
				'fl_asst_notation_type'        => 'favorite',
				'fl_asst_notation_object_type' => $object_type,
				'fl_asst_notation_object_id'   => (int) $object_id,
				'fl_asst_notation_user_id'     => (int) $user_id,
			]
		);
	}

	/**
	 * Get an array of labels for the given object.
	 * @return array
	 */
	public function get_labels( $object_type, $object_id ) {
		return $this->get_by_meta(
			[
				'fl_asst_notation_type'        => 'label',
				'fl_asst_notation_object_type' => $object_type,
				'fl_asst_notation_object_id'   => (int) $object_id,
			]
		);
	}

	/**
	 * Get an array of label notations for the given label ID.
	 * @return array
	 */
	public function get_labels_by_id( $object_type, $label_id ) {
		return $this->get_by_meta(
			[
				'fl_asst_notation_type'        => 'label',
				'fl_asst_notation_object_type' => $object_type,
				'fl_asst_notation_label_id'    => (int) $label_id,
			]
		);
	}
}
