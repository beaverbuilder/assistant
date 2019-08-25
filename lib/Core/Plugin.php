<?php

namespace FL\Assistant\Core;

use FL\Assistant\Providers\CloudProvider;
use FL\Assistant\Providers\PluginProvider;
use FL\Assistant\Providers\ProviderInterface;
use FL\Assistant\Providers\RestProvider;
use FL\Assistant\Providers\ViewProvider;

/**
 * Class Plugin
 * @package FL\Assistant\Core
 */
class Plugin {

	/**
	 * Providers are registered in the order they are listed here
	 * @var array
	 */
	static $providers = [
		PluginProvider::class,
		ViewProvider::class,
		RestProvider::class,
		CloudProvider::class,
	];

	/**
	 * @param $file
	 */
	public static function init( $file ) {

		define( 'FL_ASSISTANT_VERSION', '0.3' );
		define( 'FL_ASSISTANT_FILE', trailingslashit( $file ) );
		define( 'FL_ASSISTANT_DIR', plugin_dir_path( FL_ASSISTANT_FILE ) );
		define( 'FL_ASSISTANT_URL', plugins_url( '/', FL_ASSISTANT_FILE ) );

		$container = Container::instance();
		foreach ( static::$providers as $provider_name ) {
			$provider = new $provider_name();
			if ( $provider instanceof ProviderInterface ) {
				$provider->register( $container );
			}
		}
	}
}

