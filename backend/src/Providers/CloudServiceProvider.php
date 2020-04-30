<?php


namespace FL\Assistant\Providers;

use FL\Assistant\System\Contracts\ServiceProviderAbstract;

class CloudServiceProvider extends ServiceProviderAbstract {

	public function bootstrap() {
		$dev = defined( 'WP_DEBUG' ) && WP_DEBUG ? '-dev' : '';

		// allow this to be overridden in wp-config.php for development
		if ( ! defined( 'FL_ASSISTANT_CLOUD_URL' ) ) {
			define( 'FL_ASSISTANT_CLOUD_URL', "http://dev-web-nyc3.wpassistant.cloud/api" );
		}
		if ( ! defined( 'FL_ASSISTANT_WP_API_URL' ) ) {
			define( 'FL_ASSISTANT_WP_API_URL', "https://asst-wp$dev.network.fastlinemedia.com/wp-json" );
		}
	}
}
