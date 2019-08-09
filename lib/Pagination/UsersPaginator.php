<?php


namespace FL\Assistant\Pagination;


class UsersPaginator extends AbstractPaginator {


	public function query( array $args = [], callable $formatter = null ) {
		if ( is_null( $formatter ) ) {
			$formatter = function ( $user ) {
				return $user->data;
			};
		}

		$query = new \WP_User_Query( $args );

		if ( ! empty( $query->get_results() ) ) {

			$items_per_page = $query->get( 'number' );
			if ( empty( $items_per_page ) ) {
				$items_per_page = $query->get_total();
			}

			$offset = $query->get( 'offset' );
			if ( empty( $offset ) ) {
				$offset = 0;
			}

			$items_count  = $query->get_total();
			$current_page = ceil( ( $offset + 1 ) / $items_per_page );
			$last_page    = ceil( $items_count / $items_per_page );

			$this->setItems( array_map( $formatter, $query->get_results() ) )
				 ->setItemsPerPage( $items_per_page )
				 ->setItemsCount( $query->get_total() )
				 ->setLastPage( $last_page )
				 ->setCurrentOffset( $offset )
				 ->setCurrentPage( $current_page );

			if ( $this->getCurrentPage() < $this->getLastPage() ) {
				$this->setHasMore( true );
			}
		}

		return $this;
	}
}
