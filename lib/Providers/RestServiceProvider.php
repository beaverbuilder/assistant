<?php


namespace FL\Assistant\Providers;

use FL\Assistant\RestApi\Controllers\AttachmentsController;
use FL\Assistant\RestApi\Controllers\CommentsController;
use FL\Assistant\RestApi\Controllers\CountsController;
use FL\Assistant\RestApi\Controllers\NotationsController;
use FL\Assistant\RestApi\Controllers\NotificationsController;
use FL\Assistant\RestApi\Controllers\PostsController;
use FL\Assistant\RestApi\Controllers\SearchController;
use FL\Assistant\RestApi\Controllers\TermsController;
use FL\Assistant\RestApi\Controllers\UpdatesController;
use FL\Assistant\RestApi\Controllers\UsersController;
use FL\Assistant\System\Contracts\ServiceProviderAbstract;

/**
 * Class RestServiceProvider
 * @package FL\Assistant\Providers
 */
class RestServiceProvider extends ServiceProviderAbstract {

	/**
	 * Registered controllers
	 * @var array
	 */
	protected $controllers = [
		AttachmentsController::class,
		CommentsController::class,
		CountsController::class,
		NotationsController::class,
		NotificationsController::class,
		PostsController::class,
		TermsController::class,
		UpdatesController::class,
		UsersController::class,
		SearchController::class,
	];


	/**
	 *
	 */
	public function bootstrap() {
		add_action( 'rest_api_init', [ $this, "register_routes" ] );
	}


	/**
	 * @throws \FL\Assistant\System\Container\InjectionException
	 */
	public function register_routes() {
		foreach ( $this->controllers as $controller_name ) {
			/** @var ControllerAbstract $controller */
			$controller = $this->injector->make($controller_name);
			$controller->register_routes();
		}
	}

}
