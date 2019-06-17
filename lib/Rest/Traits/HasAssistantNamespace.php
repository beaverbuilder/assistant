<?php

namespace FL\Assistant\Rest\Traits;

trait HasAssistantNamespace {
	public static $namespace = 'fl-assistant/v1';

	public static function route( $route, array $config = []) {
		register_rest_route( static::$namespace, $route, $config );
	}
}
