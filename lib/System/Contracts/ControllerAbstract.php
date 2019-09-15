<?php


namespace FL\Assistant\System\Contracts;

use FL\Assistant\Util\HasContainer;

abstract class ControllerAbstract {

	use HasContainer;

	/**
	 * @var string
	 */
	protected $namespace = 'fl-assistant/v1';

	public function route( $route, array $config = [] ) {
		register_rest_route( $this->namespace, $route, $config );
	}

	abstract public function register_routes();
}
