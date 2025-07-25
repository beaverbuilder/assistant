<?php

namespace FL\Assistant\Providers;

use FL\Assistant\System\Contracts\ServiceProviderAbstract;
use FL\Assistant\Helpers\BeaverBuilderHelper;

use FL\Assistant\Hooks\Actions\OnEditUserProfile;
use FL\Assistant\Hooks\Actions\OnEnqueueScripts;
use FL\Assistant\Hooks\Actions\OnPersonalOptionsUpdate;
use FL\Assistant\Hooks\Actions\OnWPBeforeAdminBarRender;
use FL\Assistant\Hooks\Actions\OnBeforeDeletePost;
use FL\Assistant\Hooks\Actions\OnDeleteTerm;
use FL\Assistant\Hooks\Actions\OnCustomizeRegister;
use FL\Assistant\Hooks\Actions\OnWPHead;
use FL\Assistant\Hooks\Actions\OnWP;

use FL\Assistant\Hooks\Filters\OnHeartbeatReceived;
use FL\Assistant\Hooks\Filters\OnFLBuilderUIBarButtons;
use FL\Assistant\Hooks\Filters\OnScriptLoaderTag;

use FL\Assistant\Hooks\AdminColumns;
use FL\Assistant\Hooks\ImageProxy;
use FL\Assistant\Hooks\PostPreview;
use FL\Assistant\Hooks\CustomizerPreview;

class HooksServiceProvider extends ServiceProviderAbstract {

	/**
	 * @throws \FL\Assistant\System\Container\InjectionException
	 */
	public function bootstrap() {

		register_activation_hook(
			FL_ASSISTANT_FILE, function () {
				do_action( 'fl_assistant_activate' );
			}
		);

		$this->actions();
		$this->filters();

		new AdminColumns();
		new ImageProxy();
		new PostPreview();
		new CustomizerPreview();
	}

	public function actions() {

		// Enqueue Assistant frontend
		$enqueue_scripts = $this->injector->make( OnEnqueueScripts::class );
		$priority = BeaverBuilderHelper::is_assistant_extension() ? 1 : 10;
		add_action( 'wp_enqueue_scripts', $enqueue_scripts, $priority );
		add_action( 'admin_enqueue_scripts', $enqueue_scripts, $priority );
		add_action( 'fl_builder_ui_enqueue_scripts', $enqueue_scripts, $priority );

		// setup user profile meta fields - shows on YOUR profile, not on others.
		add_action( 'show_user_profile', $this->injector->make( OnEditUserProfile::class ) );
		add_action( 'personal_options_update', $this->injector->make( OnPersonalOptionsUpdate::class ) );

		// Add Assistant Toolbar Item
		add_action( 'wp_before_admin_bar_render', $this->injector->make( OnWPBeforeAdminBarRender::class ) );

		// post actions
		add_action( 'before_delete_post', $this->injector->make( OnBeforeDeletePost::class ) );

		// taxonomy actions
		add_action( 'delete_term', $this->injector->make( OnDeleteTerm::class ) );

		// Customize register
		add_action( 'customize_register', $this->injector->make( OnCustomizeRegister::class ) );

		// Code snippets
		add_action( 'wp_head', $this->injector->make( OnWPHead::class ) );
		add_action( 'wp', $this->injector->make( OnWP::class ) );

	}

	public function filters() {

		// setup heartbeat
		add_filter( 'heartbeat_received', $this->injector->make( OnHeartbeatReceived::class ), 11, 2 );

		add_filter( 'fl_builder_ui_bar_buttons', $this->injector->make( OnFLBuilderUIBarButtons::class ) );

		add_filter( 'script_loader_tag', $this->injector->make( OnScriptLoaderTag::class ), 10, 3 );
	}
}
