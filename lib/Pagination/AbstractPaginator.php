<?php


namespace FL\Assistant\Pagination;

abstract class AbstractPaginator implements \JsonSerializable {

	protected $items = [];
	protected $items_count = 0;
	protected $items_per_page = 20;
	protected $first_page = 1;
	protected $last_page = 1;
	protected $current_page = 1;
	protected $current_offset = 0;
	protected $has_more = false;

	/**
	 * @return bool
	 */
	public function hasMore() {
		return $this->has_more;
	}

	/**
	 * @param bool $has_more
	 *
	 * @return AbstractPaginator
	 */
	public function setHasMore( $has_more ) {
		$this->has_more = $has_more;

		return $this;
	}

	abstract public function query( array $args = [], Callable $formatter = null );

	/**
	 * @return array
	 */
	public function getItems() {
		return $this->items;
	}

	/**
	 * @param array $items
	 *
	 * @return AbstractPaginator
	 */
	public function setItems( $items ) {
		$this->items = $items;

		return $this;
	}

	/**
	 * @return int
	 */
	public function getItemsCount() {
		return $this->items_count;
	}

	/**
	 * @param int $items_count
	 *
	 * @return AbstractPaginator
	 */
	public function setItemsCount( $items_count ) {
		$this->items_count = $items_count;

		return $this;
	}

	/**
	 * @return int
	 */
	public function getItemsPerPage() {
		return $this->items_per_page;
	}

	/**
	 * @param int $items_per_page
	 *
	 * @return AbstractPaginator
	 */
	public function setItemsPerPage( $items_per_page ) {
		$this->items_per_page = $items_per_page;

		return $this;
	}

	/**
	 * @return int
	 */
	public function getFirstPage() {
		return $this->first_page;
	}

	/**
	 * @param int $first_page
	 *
	 * @return AbstractPaginator
	 */
	public function setFirstPage( $first_page ) {
		$this->first_page = $first_page;

		return $this;
	}

	/**
	 * @return int
	 */
	public function getLastPage() {
		return $this->last_page;
	}

	/**
	 * @param int $last_page
	 *
	 * @return AbstractPaginator
	 */
	public function setLastPage( $last_page ) {
		$this->last_page = $last_page;

		return $this;
	}

	/**
	 * @return int
	 */
	public function getCurrentPage() {
		return $this->current_page;
	}

	/**
	 * @param int $current_page
	 *
	 * @return AbstractPaginator
	 */
	public function setCurrentPage( $current_page ) {
		$this->current_page = $current_page;

		return $this;
	}

	/**
	 * @return int
	 */
	public function getCurrentOffset() {
		return $this->current_offset;
	}

	/**
	 * @param int $current_offset
	 *
	 * @return AbstractPaginator
	 */
	public function setCurrentOffset( $current_offset ) {
		$this->current_offset = $current_offset;

		return $this;
	}



	/**
	 * Specify data which should be serialized to JSON
	 * @link https://php.net/manual/en/jsonserializable.jsonserialize.php
	 * @return mixed data which can be serialized by <b>json_encode</b>,
	 * which is a value of any type other than a resource.
	 * @since 5.4.0
	 */
	public function jsonSerialize() {
		return $this->to_array();
	}

	public function to_array() {
		return [
			'items' => $this->getItems(),
			'items_count' => $this->getItemsCount(),
			'items_per_page' => $this->getItemsPerPage(),
			'current_page' => $this->getCurrentPage(),
			'current_offset' => $this->getCurrentOffset(),
			'first_page' => $this->getFirstPage(),
			'last_page' => $this->getLastPage()
		];
	}
}
