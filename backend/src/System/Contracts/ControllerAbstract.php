<?php

namespace FL\Assistant\System\Contracts;

use FL\Assistant\Data\Pager;

abstract class ControllerAbstract {


	/**
	 * @var string
	 */
	protected $namespace = 'fl-assistant/v1';

	public function route( $route, array $config = [] ) {
		register_rest_route( $this->namespace, $route, $config );
	}

	abstract public function register_routes();

	/**
	 * Paginates the contents of an array
	 *
	 * @param array $data - complete list of items to paginate
	 * @param $limit
	 * @param $offset
	 *
	 * @return Pager
	 */
	public function paginate_array( array $data, $limit, $offset ) {

		$items = array_slice( $data, $offset, $limit, false );
		$total = count( $items );
		$limit = intval( $limit );
		$offset = intval( $offset );

		return new Pager( $items, $total, $limit, $offset );
	}
}
