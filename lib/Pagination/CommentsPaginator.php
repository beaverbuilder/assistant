<?php

namespace FL\Assistant\Pagination;

class CommentsPaginator extends AbstractPaginator {

	public function query( array $args = [], Callable $formatter = null ) {
		$args['no_found_rows'] = false;

		if(empty($args['offset'])) {
			$args['offset'] = 0;
		}

		if(empty($args['number'])) {
			$args['number'] = 5;
		}

		$query = new \WP_Comment_Query( $args );

		if ( $query->found_comments > 0 ) {

			$offset         = intval( $query->query_vars['offset'] );
			$items_per_page = intval( $query->query_vars['number'] );
			$current_page   = ceil( ( $offset + 1 ) / $items_per_page );
			$last_page      = $query->max_num_pages;

			$this->setItems(array_map( $formatter, $query->get_comments() ))
				->setItemsCount($query->found_comments)
				->setItemsPerPage($items_per_page)
				->setLastPage($last_page)
				->setCurrentPage($current_page)
				->setCurrentOffset($offset);

			if ( $current_page < $last_page ) {
				$this->setHasMore(true);
			}
		}

		return $this;

	}

}
