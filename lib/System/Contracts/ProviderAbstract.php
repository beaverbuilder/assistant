<?php


namespace FL\Assistant\System\Contracts;


use FL\Assistant\System\Container\Injector;

/**
 * Class ProviderAbstract
 * @package FL\Assistant\System\Contracts
 */
abstract class ProviderAbstract {
	/**
	 * @var Injector
	 */
	protected $injector;

	/**
	 * ProviderAbstract constructor.
	 *
	 * @param Injector $injector
	 */
	public function __construct( Injector $injector ) {
		$this->injector = $injector;
	}

	abstract public function bootstrap();
}
