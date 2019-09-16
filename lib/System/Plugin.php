<?php

namespace FL\Assistant\System;

use FL\Assistant\Providers\CloudServiceProvider;
use FL\Assistant\Providers\DataServiceProvider;
use FL\Assistant\Providers\HooksServiceProvider;
use FL\Assistant\Providers\RestServiceProvider;
use FL\Assistant\Providers\ViewServiceProvider;
use FL\Assistant\System\Container\Injector;


/**
 * Class Plugin
 * @package FL\Assistant\Core
 */
class Plugin {

	/**
	 * @var Injector
	 */
	protected $injector;

	/**
	 * Providers are registered in the order they are listed here
	 * @var array
	 */
	public $providers = [

		ViewServiceProvider::class,
		DataServiceProvider::class,
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
	public function __construct( $pluginFile ) {

		define( 'FL_ASSISTANT_VERSION', '0.3' );
		define( 'FL_ASSISTANT_FILE', trailingslashit( $pluginFile ) );
		define( 'FL_ASSISTANT_DIR', plugin_dir_path( FL_ASSISTANT_FILE ) );
		define( 'FL_ASSISTANT_URL', plugins_url( '/', FL_ASSISTANT_FILE ) );

		$this->check_minimum_php_requirements();
		$this->bootstrap_providers();

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


	/**
	 * @throws \FL\Assistant\System\Container\InjectionException
	 */
	public function bootstrap_providers() {
		$this->injector = new Injector();
		foreach ( $this->providers as $provider_class ) {
			$provider = $this->injector->make( $provider_class, [ $this->injector ] );
			$this->injector->execute( [ $provider, "bootstrap" ] );
		}
	}

}

