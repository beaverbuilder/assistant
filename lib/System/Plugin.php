<?php

namespace FL\Assistant\Core;

use FL\Assistant\Providers\CloudProvider;
use FL\Assistant\Providers\DataProvider;
use FL\Assistant\Providers\HooksProvider;
use FL\Assistant\Providers\RestProvider;
use FL\Assistant\Providers\ViewProvider;
use FL\Assistant\System\Container\Injector;
use FL\Assistant\System\PhpVersionCheck;

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
		DataProvider::class,
		HooksProvider::class,
		RestProvider::class,
		ViewProvider::class,
		CloudProvider::class,
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

