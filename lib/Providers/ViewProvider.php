<?php


namespace FL\Assistant\Providers;

use FL\Assistant\Core\Container;
use FL\Assistant\Util\View;

class ViewProvider implements ProviderInterface {

	public function register( Container $container ) {
		$template_dir = sprintf("%s/lib/views", FL_ASSISTANT_DIR);

		$container->register_service('view', function($container) use ($template_dir) {
			return new View($template_dir);
		});
	}
}
