<?php


namespace FL\Assistant\Providers;

use FL\Assistant\RestApi\Controllers\SearchController;
use FL\Assistant\RestApi\Controllers\AttachmentsController;
use FL\Assistant\RestApi\Controllers\CommentsController;
use FL\Assistant\RestApi\Controllers\CountsController;
use FL\Assistant\RestApi\Controllers\NotationsController;
use FL\Assistant\RestApi\Controllers\NotificationsController;
use FL\Assistant\RestApi\Controllers\PostsController;
use FL\Assistant\RestApi\Controllers\TermsController;
use FL\Assistant\RestApi\Controllers\UpdatesController;
use FL\Assistant\RestApi\Controllers\UsersController;
use FL\Assistant\System\Contracts\ProviderAbstract;

/**
 * Class RestProvider
 * @package FL\Assistant\Providers
 */
class RestProvider extends ProviderAbstract {

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


	public function bootstrap() {
		$callback = $this->register_routes();
		add_action( 'rest_api_init', $callback );
	}


//	public function register_routes( Container $container ) {
//
//		$controllers = $this->controllers;
//
//		return function () use ( $container, $controllers ) {
//
//			foreach ( $controllers as $controller_name ) {
//				/** @var ControllerAbstract $controller */
//				$controller = new $controller_name( $container );
//				$controller->register_routes();
//			}
//
//		};
//	}

}
