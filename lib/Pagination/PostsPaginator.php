<?php


namespace FL\Assistant\Pagination;


class PostsPaginator extends AbstractPaginator {

	public function query( array $args = [], Callable $mapper = null ) {

		if ( null === $mapper ) {
			$mapper = function ( $post ) {
				return $post;
			};
		}

		$query = new \WP_Query( $args );

		$pager = [];
		if ( $query->have_posts() ) {

			$offset         = $query->get( 'offset' );
			$items_per_page = $query->post_count;
			$current_page   = ceil( ($offset+1) / $items_per_page );

			$pager['items']          = array_map( $mapper, $query->posts );
			$pager['items_count']    = intval( $query->found_posts );
			$pager['items_per_page'] = $items_per_page;
			$pager['last_page']      = $pager['total_pages'] = $last_page = $query->max_num_pages;
			$pager['current_offset'] = $offset;
			$pager['current_page']   = $current_page;

			if ( $current_page < $last_page ) {
				$pager['has_more'] = true;
			}
		}

		$this->pagerData = array_merge( $this->pagerData, $pager );

		return $this;
	}
}
