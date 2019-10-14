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

	public function save_defaults() {
		$did_install = get_option( static::FL_ASST_INSTALLED_LABELS, false );
		$existing = $this->query( [
			'hide_empty' => false,
		] )->get_terms();

		if ( $did_install || count( $existing ) > 0 ) {
			return;
		}

		$default_labels = [
			'F8345A' => __( 'Red', 'fl-assistant' ),
			'FE9600' => __( 'Orange', 'fl-assistant' ),
			'FFCF00' => __( 'Yellow', 'fl-assistant' ),
			'01D281' => __( 'Green', 'fl-assistant' ),
			'18AEFA' => __( 'Blue', 'fl-assistant' ),
		];

		foreach ( $default_labels as $color => $label ) {
			$result = wp_insert_term( $label, 'fl_asst_label', [
				'slug' => sanitize_key( $label ),
			] );

			if ( ! is_wp_error( $result ) ) {
				update_term_meta( $result['term_id'], static::FL_ASST_NOTATION_COLOR, $color );
			}
		}

		update_option( static::FL_ASST_INSTALLED_LABELS, true );
	}
}
