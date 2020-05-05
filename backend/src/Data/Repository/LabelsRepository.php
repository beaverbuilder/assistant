<?php

namespace FL\Assistant\Data\Repository;


class LabelsRepository extends TermsRepository {

	/**
	 * Storage keys.
	 */
	const FL_ASST_INSTALLED_LABELS = 'fl_asst_installed_labels';
	const FL_ASST_NOTATION_COLOR = 'fl_asst_notation_color';

	/**
	 * @param array $args
	 *
	 * @return \WP_Query
	 */
	public function query( array $args = [] ) {
		$args = array_merge(
			$args, [
				'taxonomy' => 'fl_asst_label',
			]
		);

		return parent::query( $args );
	}

	/**
	 * @return array
	 */
	public function count() {
		global $wpdb;

		$terms = $this->query(
			[
				'hide_empty' => false,
			]
		)->get_terms();

		$counts = [];
		$subqueries = [];

		foreach ( $terms as $term ) {
			$subqueries[] = $wpdb->prepare(
				"(SELECT COUNT(*)
				FROM $wpdb->postmeta
				WHERE meta_key = 'fl_asst_notation_label_id'
				AND meta_value = %d) as label_%d",
				$term->term_id,
				$term->term_id
			);
		}

		$results = $wpdb->get_row( 'SELECT ' . implode( ',', $subqueries ) );
		$counts = [];

		foreach ( $results as $key => $count ) {
			$key = str_replace( 'label_', '', $key );
			$counts[ $key ] = $count;
		}

		return $counts;
	}

	/**
	 * @param string $object_type
	 * @param int $label_id
	 * @return array
	 */
	function get_object_ids( $object_type, $label_id ) {
		global $wpdb;

		$results = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT m1.meta_value
				FROM $wpdb->postmeta m1
				INNER JOIN $wpdb->postmeta m2
					ON m1.post_id = m2.post_id
					AND m1.meta_key = 'fl_asst_notation_object_id'
					AND m2.meta_key = 'fl_asst_notation_label_id'
					AND m2.meta_value = %d
				INNER JOIN $wpdb->postmeta m3
					ON m1.post_id = m3.post_id
					AND m3.meta_key = 'fl_asst_notation_object_type'
					AND m3.meta_value = %s",
				$label_id,
				$object_type
			)
		);

		$ids = [];

		foreach ( $results as $result ) {
			$ids[] = $result->meta_value;
		}

		return $ids;
	}

	/**
	 * @return void
	 */
	public function save_defaults() {
		$did_install = get_option( static::FL_ASST_INSTALLED_LABELS, false );
		$existing = $this->query(
			[
				'hide_empty' => false,
			]
		)->get_terms();

		if ( $did_install || count( $existing ) > 0 ) {
			return;
		}

		/**
		 * Note: Colors changed here need to be changed in
		 * Color.knownColors on the frontend as well.
		 *
		 * TODO: Load from server config.
		 */
		$default_labels = [
			'#FF305C' => __( 'Red', 'fl-assistant' ),
			'#FF9500' => __( 'Orange', 'fl-assistant' ),
			'#FFD000' => __( 'Yellow', 'fl-assistant' ),
			'#00D281' => __( 'Green', 'fl-assistant' ),
			'#1BADF8' => __( 'Blue', 'fl-assistant' ),
		];

		foreach ( $default_labels as $color => $label ) {
			$result = wp_insert_term(
				$label, 'fl_asst_label', [
					'slug' => sanitize_key( $label ),
				]
			);

			if ( ! is_wp_error( $result ) ) {
				update_term_meta( $result['term_id'], static::FL_ASST_NOTATION_COLOR, $color );
			}
		}

		update_option( static::FL_ASST_INSTALLED_LABELS, true );
	}
}
