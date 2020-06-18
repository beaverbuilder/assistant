<?php


namespace FL\Assistant\Providers;

use FL\Assistant\System\Contracts\ServiceProviderAbstract;

class CloudServiceProvider extends ServiceProviderAbstract {

	public function bootstrap() {

		if ( ! defined( 'FL_ASSISTANT_CLOUD_URL' ) ) {
			define( 'FL_ASSISTANT_CLOUD_URL', '' );
		}
		if ( ! defined( 'FL_ASSISTANT_CLOUD_APP_URL' ) ) {
			define( 'FL_ASSISTANT_CLOUD_APP_URL', '' );
		}
	}
}
