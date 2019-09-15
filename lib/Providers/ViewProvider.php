<?php


namespace FL\Assistant\Providers;


use FL\Assistant\Helpers\ViewHelper;
use FL\Assistant\System\Contracts\ProviderAbstract;

class ViewProvider extends ProviderAbstract {


	public function bootstrap() {

		$this->injector->define( ViewHelper::class, [
			"template_dir" => sprintf( '%s/lib/views', FL_ASSISTANT_DIR )
		] );
	}
}
