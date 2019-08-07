<?php


namespace FL\Assistant\Pagination;


class AttachmentsPaginator extends AbstractPaginator {

	public function query( array $args = [], callable $mapper = null ) {

		if ( null === $mapper ) {
			$mapper = function ( $post ) {
				return $post;
			};
		}

		$query = new \WP_Query($args);


	}
}
