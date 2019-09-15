<?php


namespace FL\Assistant\Providers;

use FL\Assistant\System\Contracts\ProviderAbstract;

class CloudProvider extends ProviderAbstract {

	public function bootstrap() {
		// allow this to be overridden in wp-config.php for development
		if ( ! defined( 'FL_ASSISTANT_CLOUD_URL' ) ) {
			define( 'FL_ASSISTANT_CLOUD_URL', 'http://localhost:8000/api' );
		}
	}
}
