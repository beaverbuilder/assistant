<?php


namespace FL\Assistant\Pagination;


class UpdatesPaginator extends AbstractPaginator {

	public function paginate( $items = [] ) {
		$this->set_items( $items );
		$this->set_items_count( count( $items ) );
		$this->set_items_per_page( count( $items ) );
		return $this;
	}
}
