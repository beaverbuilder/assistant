<?php

namespace FL\Assistant\Hooks\Actions;

use FL\Assistant\Data\Repository\NotationsRepository;

/**
 * Class OnDeleteTerm
 * @package FL\Assistant\Hooks\Actions
 */
class OnDeleteTerm {

	protected $notations;

	public function __construct( NotationsRepository $notations ) {
		$this->notations = $notations;
	}

	public function __invoke( $term_id ) {
		$results = $this->notations->get_labels_by_id( 'post', $term_id );

		foreach ( $results as $label ) {
			wp_delete_post( $label['id'] );
		}
	}
}
