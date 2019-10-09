<?php


namespace FL\Assistant\Providers;


use FL\Assistant\PostTypes\NotationsPostType;
use FL\Assistant\System\Contracts\ServiceProviderAbstract;
use System\Contracts\PostTypeAbstract;

class PostTypeServiceProvider extends ServiceProviderAbstract {

	protected $post_types = [
		NotationsPostType::class,
	];

	/**
	 * @throws \FL\Assistant\System\Container\InjectionException
	 */
	public function bootstrap() {
		add_action( 'init', [ $this, 'on_wordpress_init' ] );
	}

	public function on_wordpress_init() {
		foreach ( $this->post_types as $post_type ) {
			/** @var PostTypeAbstract $pt */
			$pt = $this->injector->make( $post_type );
			$pt->register();
		}
	}
}
