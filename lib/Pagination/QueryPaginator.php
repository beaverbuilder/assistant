<?php


namespace FL\Assistant\Pagination;


abstract class QueryPaginator extends AbstractPaginator {

	abstract public function query( array $args = [], callable $formatter = null );
}
