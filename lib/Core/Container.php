<?php


namespace FL\Assistant\Core;

use FL\Assistant\Providers\ProviderInterface;

use Closure;

/**
 * Class Container
 * @package FL\Assistant
 */
class Container {

	/**
	 * @var Container
	 */
	private static $instance;

	/**
	 * @var array
	 */
	protected $values = [];

	/**
	 * @var array
	 */
	protected $services = [];


	/**
	 * @return static
	 */
	public static function instance() {
		if ( ! ( self::$instance instanceof self ) ) {
			self::$instance = new self;
		}

		return self::$instance;
	}

	/**
	 * @param ProviderInterface $provider
	 */
	public function register_provider( ProviderInterface $provider ) {
		$provider->register( $this );
	}

	/**
	 * @param string $key
	 * @param Closure $closure
	 */
	public function register_service( $key, Closure $closure ) {
		$this->services[ $key ] = $this->singleton_factory( $closure );
	}

	/**
	 * @param string $key
	 *
	 * @return object The service registered to the $key
	 * @throws \Exception
	 */
	public function service( $key ) {
		if ( ! isset( $this->services[ $key ] ) ) {
			throw new \Exception( "Service $key is not registered" );
		}

		if ( ! ( $this->services[ $key ] instanceof Closure ) ) {
			throw new \Exception( "Service $key was not a Closure" );
		}

		return $this->services[ $key ]( $this );
	}

	/**
	 * @param $key
	 */
	public function unregister_service( $key ) {
		unset( $this->services[ $key ] );
	}

	/**
	 * Checks if there's a value in the container for the given key.
	 *
	 * @param mixed $key
	 *
	 * @return bool
	 */
	public function has( $key ) {
		return array_key_exists( $key, $this->values );
	}

	/**
	 * Get a value from the container.
	 *
	 * @param $key
	 *
	 * @return mixed
	 * @throws \Exception
	 */
	public function get( $key ) {
		if ( ! $this->has( $key ) ) {
			throw new \Exception( sprintf( 'Container doesn\'t have a value stored for the "%s" key.', $key ) );
		}

		if ( $this->values[ $key ] instanceof Closure ) {
			return $this->values[ $key ]( $this );
		}

		return $this->values[ $key ];
	}

	/**
	 * Sets a value inside of the container.
	 *
	 * @param mixed $key
	 * @param mixed $value
	 */
	public function set( $key, $value ) {
		$this->values[ $key ] = $value;
	}

	/**
	 * Unset the value in the container for the given key.
	 *
	 * @param mixed $key
	 */
	public function remove( $key ) {
		unset( $this->values[ $key ] );
	}

	/**
	 * Creates a closure used for creating a service using the given callable.
	 *
	 * @param Closure $closure
	 *
	 * @return Closure
	 */
	public function singleton_factory( Closure $closure ) {
		return function ( Container $container ) use ( $closure ) {
			static $object;

			if ( null === $object ) {
				$object = $closure( $container );
			}

			return $object;
		};
	}
}
