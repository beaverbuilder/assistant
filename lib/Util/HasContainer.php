<?php


namespace FL\Assistant\Util;

use FL\Assistant\Core\Container;

/**
 * Trait HasContainer
 * @package FL\Assistant\Util
 */
trait HasContainer {

	/**
	 * @var Container
	 */
	private $container;

	public function __construct( Container $container ) {
		$this->container = $container;
	}

	public function container() {
		return $this->container;
	}

	public function service( $service_name ) {
		return $this->container()->service( $service_name );
	}

}
