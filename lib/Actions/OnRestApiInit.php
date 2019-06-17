<?php

namespace FL\Assistant\Actions;

use FL\Assistant\Rest\AttachmentsController;
use FL\Assistant\Rest\CommentsController;
use FL\Assistant\Rest\CountsController;
use FL\Assistant\Rest\NotificationsController;
use FL\Assistant\Rest\PostsController;
use FL\Assistant\Rest\TermsController;
use FL\Assistant\Rest\UpdatesController;
use FL\Assistant\Rest\UsersController;

class OnRestApiInit {

	public function __invoke() {
		if ( is_user_logged_in() ) {
			AttachmentsController::register_routes();
			CommentsController::register_routes();
			CountsController::register_routes();
			NotificationsController::register_routes();
			PostsController::register_routes();
			TermsController::register_routes();
			UpdatesController::register_routes();
			UsersController::register_routes();
		}
	}
}
