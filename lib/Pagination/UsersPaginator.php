<?php


namespace FL\Assistant\Pagination;


class UsersPaginator extends QueryPaginator {


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

			$this->set_items( array_map( $formatter, $query->get_results() ) )
				 ->set_items_per_page( $items_per_page )
				 ->set_items_count( $query->get_total() )
				 ->set_last_page( $last_page )
				 ->set_current_offset( $offset )
				 ->set_current_page( $current_page );

			if ( $this->get_current_page() < $this->get_last_page() ) {
				$this->set_has_more( true );
			}
		}

		return $this;
	}
}
