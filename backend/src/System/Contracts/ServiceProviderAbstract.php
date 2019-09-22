<?php


namespace FL\Assistant\System\Contracts;


use FL\Assistant\System\Container\Injector;

/**
 * Class ServiceProviderAbstract
 * @package FL\Assistant\System\Contracts
 */
abstract class ServiceProviderAbstract {
	/**
	 * @var Injector
	 */
	protected $injector;

	/**
	 * ServiceProviderAbstract constructor.
	 *
	 * @param Injector $injector
	 */
	public function __construct( Injector $injector ) {
		$this->injector = $injector;
	}

	abstract public function bootstrap();
}
