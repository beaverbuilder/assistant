<?php

namespace FL\Assistant\Core;

use FL\Assistant\Providers\CloudProvider;
use FL\Assistant\Providers\PluginProvider;
use FL\Assistant\Providers\RestProvider;


class Plugin {

	public static function init( $file ) {

		define( 'FL_ASSISTANT_VERSION', '0.3' );
		define( 'FL_ASSISTANT_FILE', trailingslashit( $file ) );
		define( 'FL_ASSISTANT_DIR', plugin_dir_path( FL_ASSISTANT_FILE ) );
		define( 'FL_ASSISTANT_URL', plugins_url( '/', FL_ASSISTANT_FILE ) );

		$container = Container::instance();
		$container->register_provider( new PluginProvider() );
		$container->register_provider( new RestProvider() );
		$container->register_provider( new CloudProvider() );
	}
}

