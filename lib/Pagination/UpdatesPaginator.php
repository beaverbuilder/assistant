<?php


namespace FL\Assistant\Pagination;


class UpdatesPaginator extends AbstractPaginator {

	public function query( array $args = [], callable $formatter = null ) {
		return $this;
	}

	public function paginate( $items = [] ) {
		$this->setItems( $items );
		$this->setItemsCount( count( $items ) );
		$this->setItemsPerPage( count( $items ) );
		return $this;
	}
}
