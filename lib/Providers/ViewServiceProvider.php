<?php


namespace FL\Assistant\Providers;


use FL\Assistant\System\View;
use FL\Assistant\System\Contracts\ServiceProviderAbstract;

class ViewServiceProvider extends ServiceProviderAbstract {


	public function bootstrap() {

		$this->injector->defineParam("template_dir", sprintf( '%s/lib/views', FL_ASSISTANT_DIR ));
		$this->injector->define( View::class, [":template_dir"]);
	}
}
