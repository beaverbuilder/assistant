<?php


namespace FL\Assistant\Pagination;


class CommentsPaginator extends AbstractPaginator {

	public function query( array $args = [], Callable $mapper = null ) {
		$args['no_found_rows'] = false;

		if(empty($args['offset'])) {
			$args['offset'] = 0;
		}

		if(empty($args['number'])) {
			$args['number'] = 5;
		}

		$query = new \WP_Comment_Query( $args );

		$pager = [];
		if ( $query->found_comments > 0 ) {

			$offset         = intval( $query->query_vars['offset'] );
			$items_per_page = intval( $query->query_vars['number'] );
			$current_page   = ceil( ( $offset + 1 ) / $items_per_page );
			$last_page      = $query->max_num_pages;

			$pager['items']          = array_map( $mapper, $query->get_comments() );
			$pager['items_count']    = $query->found_comments;
			$pager['last_page']      = $last_page;
			$pager['current_page']   = $current_page;
			$pager['current_offset'] = $offset;

			if ( $current_page < $last_page ) {
				$pager['has_more'] = true;
			}
		}

		$this->pagerData = array_merge( $this->pagerData, $pager );

		return $this;

	}

}
