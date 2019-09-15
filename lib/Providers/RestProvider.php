<?php


namespace FL\Assistant\Providers;

use FL\Assistant\Core\Container;
use FL\Assistant\RestApi\Controllers\SearchController;
use FL\Assistant\RestApi\Controllers\AssistantController;
use FL\Assistant\RestApi\Controllers\AttachmentsController;
use FL\Assistant\RestApi\Controllers\CommentsController;
use FL\Assistant\RestApi\Controllers\CountsController;
use FL\Assistant\RestApi\Controllers\NotationsController;
use FL\Assistant\RestApi\Controllers\NotificationsController;
use FL\Assistant\RestApi\Controllers\PostsController;
use FL\Assistant\RestApi\Controllers\TermsController;
use FL\Assistant\RestApi\Controllers\UpdatesController;
use FL\Assistant\RestApi\Controllers\UsersController;

/**
 * Class RestProvider
 * @package FL\Assistant\Providers
 */
class RestProvider implements ProviderInterface {

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
	 * @param Container $container
	 */
	public function register( Container $container ) {
		$callback = $this->register_routes( $container );
		add_action( 'rest_api_init', $callback );
	}

	/**
	 * @param Container $container
	 *
	 * @return \Closure
	 */
	public function register_routes( Container $container ) {

		$controllers = $this->controllers;

		return function () use ( $container, $controllers ) {

			foreach ( $controllers as $controller_name ) {
				/** @var AssistantController $controller */
				$controller = new $controller_name( $container );
				$controller->register_routes();
			}

		};
	}

}
