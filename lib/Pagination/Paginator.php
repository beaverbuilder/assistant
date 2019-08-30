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
	public function has_more() {
		return $this->has_more;
	}

	/**
	 * @param bool $has_more
	 *
	 * @return Paginator
	 */
	public function set_has_more( $has_more ) {
		$this->has_more = $has_more;

		return $this;
	}

	abstract public function query( array $args = [], callable $formatter = null );

	/**
	 * @return array
	 */
	public function get_items() {
		return $this->items;
	}

	/**
	 * @param array $items
	 *
	 * @return Paginator
	 */
	public function set_items( $items ) {
		$this->items = $items;

		return $this;
	}

	/**
	 * @return int
	 */
	public function get_items_count() {
		return $this->items_count;
	}

	/**
	 * @param int $items_count
	 *
	 * @return Paginator
	 */
	public function set_items_count( $items_count ) {
		$this->items_count = $items_count;

		return $this;
	}

	/**
	 * @return int
	 */
	public function get_items_per_page() {
		return $this->items_per_page;
	}

	/**
	 * @param int $items_per_page
	 *
	 * @return Paginator
	 */
	public function set_items_per_page( $items_per_page ) {
		$this->items_per_page = $items_per_page;

		return $this;
	}

	/**
	 * @return int
	 */
	public function get_first_page() {
		return $this->first_page;
	}

	/**
	 * @param int $first_page
	 *
	 * @return Paginator
	 */
	public function set_first_page( $first_page ) {
		$this->first_page = $first_page;

		return $this;
	}

	/**
	 * @return int
	 */
	public function get_last_page() {
		return $this->last_page;
	}

	/**
	 * @param int $last_page
	 *
	 * @return Paginator
	 */
	public function set_last_page( $last_page ) {
		$this->last_page = $last_page;

		return $this;
	}

	/**
	 * @return int
	 */
	public function get_current_page() {
		return $this->current_page;
	}

	/**
	 * @param int $current_page
	 *
	 * @return Paginator
	 */
	public function set_current_page( $current_page ) {
		$this->current_page = $current_page;

		return $this;
	}

	/**
	 * @return int
	 */
	public function get_current_offset() {
		return $this->current_offset;
	}

	/**
	 * @param int $current_offset
	 *
	 * @return Paginator
	 */
	public function set_current_offset( $current_offset ) {
		$this->current_offset = intval( $current_offset );

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
			'items'          => $this->get_items(),
			'items_count'    => $this->get_items_count(),
			'items_per_page' => $this->get_items_per_page(),
			'current_page'   => $this->get_current_page(),
			'current_offset' => $this->get_current_offset(),
			'first_page'     => $this->get_first_page(),
			'last_page'      => $this->get_last_page(),
			'has_more'       => $this->has_more()
		];
	}
}
