<?php


namespace FL\Assistant\Providers;


use FL\Assistant\Core\Container;
use FL\Assistant\Controllers\AssistantController;
use FL\Assistant\Controllers\AttachmentsController;
use FL\Assistant\Controllers\CommentsController;
use FL\Assistant\Controllers\CountsController;
use FL\Assistant\Controllers\NotificationsController;
use FL\Assistant\Controllers\PostsController;
use FL\Assistant\Controllers\TermsController;
use FL\Assistant\Controllers\UpdatesController;
use FL\Assistant\Controllers\UsersController;

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
		NotificationsController::class,
		PostsController::class,
		TermsController::class,
		UpdatesController::class,
		UsersController::class,
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
		return function () use ( $container ) {
			foreach ( $this->controllers as $controller_name ) {
				/** @var AssistantController $controller */
				$controller = new $controller_name( $container );
				$controller->register_routes();
			}
		};
	}
}
