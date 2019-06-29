<?php


namespace FL\Assistant\Controllers;


use FL\Assistant\Core\Container;

abstract class AssistantController {

	/**
	 * @var string
	 */
	protected $namespace = 'fl-assistant/v1';

	/**
	 * @var Container
	 */
	protected $container;

	public function __construct( Container $container ) {
		$this->container = $container;
	}

	public function route( $route, array $config = [] ) {
		register_rest_route( $this->namespace, $route, $config );
	}

	abstract public function register_routes();
}
