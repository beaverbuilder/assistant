<?php

namespace FL\Assistant\Hooks\Actions;

use FL\Assistant\Data\Repository\NotationsRepository;

/**
 * Class OnBeforeDeletePost
 * @package FL\Assistant\Hooks\Actions
 */
class OnBeforeDeletePost {

	protected $notations;

	public function __construct( NotationsRepository $notations ) {
		$this->notations = $notations;
	}

	public function __invoke( $post_id ) {
		$results = $this->notations->get_notations( 'post', $post_id );

		foreach ( $results as $notation ) {
			wp_delete_post( $notation['id'] );
		}
	}
}
