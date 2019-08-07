<?php


namespace FL\Assistant\Pagination;


interface PaginatorInterface {

	public function query(array $args = [], Callable $mapper = null);

	public function items();
	public function items_count();
	public function items_per_page();

	public function first_page();
	public function last_page();
	public function total_pages();
	public function current_page();
	public function current_offset();

}
