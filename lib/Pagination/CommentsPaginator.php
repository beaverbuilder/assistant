<?php

namespace FL\Assistant\Pagination;

class CommentsPaginator extends QueryPaginator {

	public function query( array $args = [], callable $formatter = null ) {
		$args['no_found_rows'] = false;

		if ( empty( $args['offset'] ) ) {
			$args['offset'] = 0;
		}

		if ( empty( $args['number'] ) ) {
			$args['number'] = 5;
		}

		$query = new \WP_Comment_Query( $args );

		if ( $query->found_comments > 0 ) {

			$offset         = intval( $query->query_vars['offset'] );
			$items_per_page = intval( $query->query_vars['number'] );
			$current_page   = ceil( ( $offset + 1 ) / $items_per_page );
			$last_page      = $query->max_num_pages;

			$this->set_items( array_map( $formatter, $query->get_comments() ) )
				->set_items_count( $query->found_comments )
				->set_items_per_page( $items_per_page )
				->set_last_page( $last_page )
				->set_current_page( $current_page )
				->set_current_offset( $offset );

			if ( $current_page < $last_page ) {
				$this->set_has_more( true );
			}
		}

		return $this;

	}

}
