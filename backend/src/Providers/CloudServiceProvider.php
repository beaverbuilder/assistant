<?php


namespace FL\Assistant\Providers;

use FL\Assistant\System\Contracts\ServiceProviderAbstract;

class CloudServiceProvider extends ServiceProviderAbstract {

	public function bootstrap() {

		if ( ! defined( 'FL_ASSISTANT_CLOUD_URL' ) ) {
			define( 'FL_ASSISTANT_CLOUD_URL', 'https://api.beta.assistant.pro' );
		}
		if ( ! defined( 'FL_ASSISTANT_CLOUD_APP_URL' ) ) {
			define( 'FL_ASSISTANT_CLOUD_APP_URL', 'https://beta.assistant.pro' );
		}
		if ( ! defined( 'FL_ASSISTANT_PUSHER_KEY' ) ) {
			define( 'FL_ASSISTANT_PUSHER_KEY', 'd167736b3fc37d384caf' );
		}
		if ( ! defined( 'FL_ASSISTANT_PUSHER_CLUSTER' ) ) {
			define( 'FL_ASSISTANT_PUSHER_CLUSTER', 'mt1' );
		}
	}
}
