<?php


namespace FL\Assistant\Providers;


use FL\Assistant\Core\Container;

interface ProviderInterface {
	public function register( Container $container);
}
