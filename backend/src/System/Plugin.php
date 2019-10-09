<?php

namespace FL\Assistant\System;

use FL\Assistant\Providers\CloudServiceProvider;
use FL\Assistant\Providers\DataServiceProvider;
use FL\Assistant\Providers\HooksServiceProvider;
use FL\Assistant\Providers\RestServiceProvider;
use FL\Assistant\Providers\ViewServiceProvider;
use FL\Assistant\System\Util\PhpVersionCheck;
use FL\Assistant\Providers\PostTypeServiceProvider;

// Alias the injector - its our DI container.
use FL\Assistant\System\Container\Injector as Container;
use FL\Assistant\System\Util\Psr4Autoloader;

/**
 * Class Plugin
 * @package FL\Assistant\Core
 */
class Plugin {

	/**
	 * @var Container
	 */
	protected $container;

	/**
	 * Providers are registered in the order they are listed here
	 * @var array
	 */
	public $providers = [
		ViewServiceProvider::class,
		DataServiceProvider::class,
		PostTypeServiceProvider::class,
		HooksServiceProvider::class,
		RestServiceProvider::class,
		CloudServiceProvider::class,
	];

	/**
	 * Plugin constructor.
	 *
	 * @param $pluginFile
	 *
	 * @throws \FL\Assistant\System\Container\InjectionException
	 */
	public function __construct( $plugin_file ) {
		$this->check_minimum_php_requirements();

		$this->register_providers();

		// notify assistant was loaded
		do_action( 'fl_assistant_loaded' );
	}

	/**
	 *
	 */
	public function check_minimum_php_requirements() {
		$php_version_check = new PhpVersionCheck();
		$php_version_check->check();
	}

	public function register_providers() {
		$this->container = new Container();
		foreach ( $this->providers as $provider_class ) {
			$provider = $this->container->make( $provider_class, [ $this->container ] );
			$this->container->execute( [ $provider, 'bootstrap' ] );
		}
	}

}

