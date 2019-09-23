<?php


namespace FL\Assistant\Providers;


use FL\Assistant\System\View;
use FL\Assistant\System\Contracts\ServiceProviderAbstract;

class ViewServiceProvider extends ServiceProviderAbstract {


	/**
	 *
	 */
	public function bootstrap() {
		$template_dir = sprintf( '%s/backend/templates', FL_ASSISTANT_DIR );
		//      $this->injector->defineParam( 'template_dir',  );
		$this->injector->define( View::class, [ $template_dir ] );
	}
}
