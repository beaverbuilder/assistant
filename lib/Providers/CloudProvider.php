<?php


namespace FL\Assistant\Providers;

use FL\Assistant\Core\Container;

class CloudProvider implements ProviderInterface {

	/**
	 * Modifies the given dependency injection container.
	 *
	 * @param Container $container
	 */
	public function register( Container $container ) {

		// allow this to be overridden in wp-config.php for development
		if ( ! defined( 'FL_ASSISTANT_CLOUD_URL' ) ) {
			define( 'FL_ASSISTANT_CLOUD_URL', 'http://localhost:8000/api' );
		}

		$container->set( 'cloud_url', FL_ASSISTANT_CLOUD_URL );
	}

}
