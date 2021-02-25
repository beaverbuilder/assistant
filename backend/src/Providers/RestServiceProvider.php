<?php


namespace FL\Assistant\Providers;

use FL\Assistant\Controllers\AttachmentsController;
use FL\Assistant\Controllers\BatchController;
use FL\Assistant\Controllers\CommentsController;
use FL\Assistant\Controllers\CountsController;
use FL\Assistant\Controllers\CurrentUserController;
use FL\Assistant\Controllers\LabelsController;
use FL\Assistant\Controllers\NotationsController;
use FL\Assistant\Controllers\NotificationsController;
use FL\Assistant\Controllers\PostsController;
use FL\Assistant\Controllers\PostsExportController;
use FL\Assistant\Controllers\SearchController;
use FL\Assistant\Controllers\TermsController;
use FL\Assistant\Controllers\UpdatesController;
use FL\Assistant\Controllers\UsersController;
use FL\Assistant\Controllers\Cloud\Libraries\LibraryItemSvgController;
use FL\Assistant\Controllers\Cloud\Libraries\LibraryItemImageController;
use FL\Assistant\Controllers\Cloud\Libraries\LibraryItemPostController;
use FL\Assistant\Controllers\Cloud\Libraries\LibraryItemThemeSettingsController;
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
		CurrentUserController::class,
		AttachmentsController::class,
		CommentsController::class,
		CountsController::class,
		LabelsController::class,
		NotationsController::class,
		NotificationsController::class,
		PostsController::class,
		PostsExportController::class,
		TermsController::class,
		UpdatesController::class,
		UsersController::class,
		SearchController::class,
		LibraryItemSvgController::class,
		LibraryItemImageController::class,
		LibraryItemPostController::class,
		LibraryItemThemeSettingsController::class,
		BatchController::class, // Must be last
	];


	/**
	 *
	 */
	public function bootstrap() {
		add_action( 'rest_api_init', [ $this, 'register_routes' ] );
	}


	/**
	 * @throws \FL\Assistant\System\Container\InjectionException
	 */
	public function register_routes() {
		foreach ( $this->controllers as $controller_name ) {
			/** @var ControllerAbstract $controller */
			$controller = $this->injector->make( $controller_name );
			$controller->register_routes();
		}
	}

}
