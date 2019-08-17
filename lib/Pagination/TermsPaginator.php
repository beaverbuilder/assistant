<?php


namespace FL\Assistant\Pagination;


class TermsPaginator extends QueryPaginator {

	public function query( array $args = [], callable $formatter = null ) {

		if(is_null($formatter)) {
			$formatter = function($term) {
				return $term;
			};
		}

		$query = new \WP_Term_Query($args);

		if(!empty($query->get_terms())) {
			$terms = $query->get_terms();
			$this->set_items(array_map($formatter, $terms))
				->set_items_count(count($terms))
				->set_items_per_page(count($terms));
		}

		return $this;

	}
}
