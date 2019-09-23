<?php

namespace FL\Assistant\System\Container;

interface ReflectionCache {

	public function fetch( $key);
	public function store( $key, $data);
}
