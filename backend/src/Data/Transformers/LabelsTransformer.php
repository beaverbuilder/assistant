<?php


namespace FL\Assistant\Data\Transformers;

use FL\Assistant\Data\Repository\LabelsRepository;

class LabelsTransformer {

	protected $labels;

	public function __construct( LabelsRepository $labels ) {
		$this->labels = $labels;
	}

	public function __invoke( \WP_Term $term ) {
		$labels = $this->labels;
		return [
			'id'    => $term->term_id,
			'label' => $term->name,
			'slug'  => $term->slug,
			'color' => get_term_meta( $term->term_id, $labels::FL_ASST_NOTATION_COLOR, true ),
		];
	}
}
