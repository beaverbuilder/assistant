<?php


namespace FL\Assistant\Pagination;


abstract class AbstractPaginator implements PaginatorInterface, \JsonSerializable {

	protected $pagerData = [
		"has_more"       => false,
		"items"          => [],
		"items_count"    => 0,
		"items_per_page" => 20,
		"first_page"     => 1,
		"last_page"      => 1,
		"current_page"   => 1,
		"current_offset" => 0,
	];

	public function items() {
		return $this->pagerData['items'];
	}

	public function items_count() {
		return $this->pagerData['items_count'];
	}

	public function items_per_page() {
		return $this->pagerData['items_perge_page'];
	}

	public function first_page() {
		return $this->pagerData['first_page'];
	}

	public function last_page() {
		return $this->pagerData['last_page'];
	}

	public function total_pages() {
		return $this->pagerData['total_pages'];
	}

	public function current_page() {
		return $this->pagerData['current_page'];
	}

	public function current_offset() {
		return $this->pagerData['current_offset'];
	}

	/**
	 * Specify data which should be serialized to JSON
	 * @link https://php.net/manual/en/jsonserializable.jsonserialize.php
	 * @return mixed data which can be serialized by <b>json_encode</b>,
	 * which is a value of any type other than a resource.
	 * @since 5.4.0
	 */
	public function jsonSerialize() {
		return $this->pagerData;
	}

	public function to_array() {
		return $this->pagerData;
	}
}
