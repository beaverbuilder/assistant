<?php


namespace FL\Assistant\Pagination;


class PostsPaginator extends AbstractPaginator {

	public function query( array $args = [], Callable $formatter = null ) {

		if ( null === $formatter ) {
			$formatter = function ( $post ) {
				return $post;
			};
		}

		$query = new \WP_Query( $args );

		if ( $query->have_posts() ) {

			$offset         = $query->get( 'offset' );
			$items_per_page = $query->post_count;
			$current_page   = ceil( ( $offset + 1 ) / $items_per_page );

			$this->setItems( array_map( $formatter, $query->posts ) )
			     ->setItemsCount( intval( $query->found_posts ) )
			     ->setItemsPerPage( $items_per_page )
			     ->setLastPage( $query->max_num_pages )
			     ->setCurrentOffset( $offset )
			     ->setCurrentPage( $current_page );

			if ( $this->getCurrentPage() < $this->getLastPage() ) {
				$this->setHasMore( true );
			}
		}

		return $this;
	}
}
