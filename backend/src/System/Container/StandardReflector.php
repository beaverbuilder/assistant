<?php

namespace FL\Assistant\System\Container;

class StandardReflector implements Reflector {

	public function getClass( $class ) {
		return new \ReflectionClass( $class );
	}

	public function getCtor( $class ) {
		$reflectionClass = new \ReflectionClass( $class );

		return $reflectionClass->getConstructor();
	}

	public function getCtorParams( $class ) {
		return ( $reflectedCtor = $this->getCtor( $class ) )
			? $reflectedCtor->getParameters()
			: null;
	}

	public function getParamTypeHint( \ReflectionFunctionAbstract $function, \ReflectionParameter $param ) {
		if ( version_compare( PHP_VERSION, '8.0.0', '<' ) ) {
			return ( $reflectionClass = $param->getClass() )
						? $reflectionClass->getName()
						: null;
		}

		$type = $param->getType();

		if ( 'ReflectionNamedType' === get_class( $type ) ) {
			$class = new \ReflectionClass( $type->getName() );
			return $class->getName();
		}

		return null;
	}

	public function getFunction( $functionName ) {
		return new \ReflectionFunction( $functionName );
	}

	public function getMethod( $classNameOrInstance, $methodName ) {
		$className = is_string( $classNameOrInstance )
			? $classNameOrInstance
			: get_class( $classNameOrInstance );

		return new \ReflectionMethod( $className, $methodName );
	}
}
