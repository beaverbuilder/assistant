<?php


namespace FL\Assistant\RestApi\Controllers;

use FL\Assistant\Util\HasContainer;

abstract class AssistantController {

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
