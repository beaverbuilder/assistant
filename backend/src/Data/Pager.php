<?php


namespace FL\Assistant\Data;


/**
 * Class Pager
 * @package FL\Assistant\Data
 */
class Pager {
	/**
	 * @var array
	 */
	protected $items;

	/**
	 * @var int
	 */
	protected $total;

	/**
	 * @var int
	 */
	protected $limit;

	/**
	 * @var int
	 */
	protected $offset;
	/**
	 * @var mixed
	 */
	protected $last_page;
	/**
	 * @var float
	 */
	protected $current_page;

	/**
	 * @var bool
	 */
	protected $has_more;

	/**
	 * Pager constructor.
	 *
	 * @param array $items
	 * @param int $total
	 * @param int $limit
	 * @param int $offset
	 */
	public function __construct( array $items = [], $total = 0, $limit = 20, $offset = 0 ) {

		$this->items     = $items;
		$this->total     = intval( $total );
		$this->limit     = intval( $limit );
		$this->offset    = intval( $offset );

		if ( 0 === count( $items ) || 0 === $this->total || 0 === $this->limit ) {
			$this->last_page = 1;
			$this->current_page = 1;
			$this->has_more = false;
		} else {
			$this->last_page = max( (int) ceil( $this->total / $this->limit ), 1 );
			$this->current_page = ceil( ( $this->offset + 1 ) / $this->limit );
			$this->has_more = ( $this->current_page < $this->last_page );
		}
	}

	/**
	 * @return array
	 */
	public function items() {
		return $this->items;
	}

	/**
	 * @param array $items
	 *
	 * @return Pager
	 */
	public function set_items( array $items = [] ) {
		$this->items = $items;

		return $this;
	}

	/**
	 * Transforms the internal items array
	 *
	 * @param callable $transformer
	 *
	 * @return Pager
	 */
	public function apply_transform( callable $transformer ) {
		$this->items = array_map( $transformer, $this->items );

		return $this;
	}


	/**
	 * @return int
	 */
	public function total() {
		return $this->total;
	}


	/**
	 * @return int
	 */
	public function limit() {
		return $this->limit;
	}


	/**
	 * @return int
	 */
	public function offset() {
		return $this->offset;
	}


	/**
	 * @return mixed
	 */
	public function last_page() {
		return $this->last_page;
	}


	/**
	 * @return float
	 */
	public function current_page() {
		return $this->current_page;
	}


	/**
	 * @return bool
	 */
	public function has_more() {
		return $this->has_more;
	}


	/**
	 * @return array
	 */
	public function to_array() {
		return [
			'items'          => $this->items,
			'items_count'    => $this->total,
			'items_per_page' => $this->limit,
			'current_page'   => $this->current_page,
			'current_offset' => $this->offset,
			'first_page'     => 1,
			'last_page'      => $this->last_page,
			'has_more'       => $this->has_more,
		];
	}

	public function to_rest_response() {
		return rest_ensure_response( $this->to_array() );
	}
}
