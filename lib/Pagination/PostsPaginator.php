<?php


namespace FL\Assistant\Pagination;


class PostsPaginator extends QueryPaginator {

	public function query( array $args = [], callable $formatter = null ) {

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

			$this->set_items( array_map( $formatter, $query->posts ) )
				 ->set_items_count( intval( $query->found_posts ) )
				 ->set_items_per_page( $items_per_page )
				 ->set_last_page( $query->max_num_pages )
				 ->set_current_offset( $offset )
				 ->set_current_page( $current_page );

			if ( $this->get_current_page() < $this->get_last_page() ) {
				$this->set_has_more( true );
			}
		}

		return $this;
	}
}
