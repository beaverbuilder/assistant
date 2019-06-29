<?php

namespace FL\Assistant\Core;

use FL\Assistant\Providers\CloudProvider;
use FL\Assistant\Providers\PluginProvider;
use FL\Assistant\Providers\RestProvider;


class Plugin {

	public static function init() {
		$container = Container::instance();
		$container->register_provider( new PluginProvider() );
		$container->register_provider( new RestProvider() );
		$container->register_provider( new CloudProvider() );
	}

}

