<?php


namespace FL\Assistant\Providers;


use FL\Assistant\Hooks\Actions\OnEnqueueScripts;
use FL\Assistant\Hooks\Actions\RegisterNotationsPostType;
use FL\Assistant\System\Contracts\ProviderAbstract;

class HooksProvider extends ProviderAbstract {

	/**
	 * @throws \FL\Assistant\System\Container\InjectionException
	 */
	public function bootstrap() {
		add_action( 'init', $this->injector->make( RegisterNotationsPostType::class ) );

		// Enqueue Assistant frontend
		$enqueue_scripts = $this->injector->make(OnEnqueueScripts::class);
		add_action( 'wp_enqueue_scripts', $enqueue_scripts );
		add_action( 'admin_enqueue_scripts', $enqueue_scripts );

		// @TODO finish these

		// setup user profile meta fields - shows on YOUR profile, not on others.
		add_action( 'show_user_profile', new OnEditUserProfile(  ) );
		add_action( 'personal_options_update', new OnPersonalOptionsUpdate(  ) );

		// Add Assistant Toolbar Item
		add_action( 'wp_before_admin_bar_render', new OnWPBeforeAdminBarRender(  ) );

		// setup heartbeat
		add_filter( 'heartbeat_received', new OnHeartbeatReceived(), 11, 2 );

		// register activation hook
		register_activation_hook(
			FL_ASSISTANT_FILE, function () {
			do_action( 'fl_assistant_activate' );
		}
		);

		// notify assistant was loaded
		do_action( 'fl_assistant_loaded' );
	}
}
