<?php


namespace FL\Assistant\Helpers;

class PaginationHelper {


	public function posts( array $args = [] ) {
		$query = new \WP_Query( $args );
		return $this->query_pager( $query);
	}


	public function users( \WP_User_Query $query ) {
		return $this->create_pager(
			$query->get_results(),
			$query->get_total(),
			$query->get( 'number' ),
			$query->get( 'offset' )
		);
	}

	public function attachments( \WP_Query $query ) {
		return $this->query_pager( $query );
	}

	public function terms( \WP_Term_Query $query ) {

		$total_terms = $this->terms_query_count( $query );

		return $this->create_pager(
			$query->get_terms(),
			$total_terms,
			$query->query_vars['number'],
			$query->query_vars['offset']
		);
	}

	public function comments( \WP_Comment_Query $query ) {
		return $this->create_pager(
			$query->get_comments(),
			$query->found_comments,
			$query->query_vars['number'],
			$query->query_vars['offset']
		);
	}


	/**
	 * Paginates the contents of an array
	 *
	 * @param array $data - complete list of items to paginate
	 * @param $limit
	 * @param $offset
	 *
	 * @return array
	 */
	public function arrays( array $data , $limit, $offset ) {

		$items  = array_slice( $data, $offset, $limit, false );
		$total  = count( $items );
		$limit  = intval( $limit );
		$offset = intval( $offset );

		$last_page    = max( (int) ceil( $total / $limit ), 1 );
		$current_page = ceil( ( $offset + 1 ) / $limit );
		$has_more     = ( $current_page < $last_page );

		return [
			'items'          => $items,
			'items_count'    => $total,
			'items_per_page' => $limit,
			'current_page'   => $current_page,
			'current_offset' => $offset,
			'first_page'     => 1,
			'last_page'      => $last_page,
			'has_more'       => $has_more,
		];
	}

	protected function terms_query_count( \WP_Term_Query $query ) {
		$taxonomy = $query->query_vars['taxonomy'];
		$args     = $query->query_vars;

		return \wp_count_terms( $taxonomy, $args );
	}

	protected function query_pager( \WP_Query $query) {
		return $this->create_pager(
			$query->posts,
			$query->found_posts,
			$query->post_count,
			$query->get( 'offset' )
		);
	}


	/**
	 * Generate Pager
	 *
	 * @param $resource_type
	 * @param array $items
	 * @param int $total
	 * @param int $limit
	 * @param int $offset
	 *
	 * @return array
	 */
	protected function create_pager(
		array $items = [],
		$total = 0,
		$limit = 0,
		$offset = 0
	) {

		$total  = intval( $total );
		$limit  = intval( $limit );
		$offset = intval( $offset );

		$last_page    = max( (int) ceil( $total / $limit ), 1 );
		$current_page = ceil( ( $offset + 1 ) / $limit );
		$has_more     = ( $current_page < $last_page );
//		$items        = apply_transform_ref_array( $resource_type, $items );

		return [
			'items'          => $items,
			'items_count'    => $total,
			'items_per_page' => $limit,
			'current_page'   => $current_page,
			'current_offset' => $offset,
			'first_page'     => 1,
			'last_page'      => $last_page,
			'has_more'       => $has_more,
		];
	}
}
