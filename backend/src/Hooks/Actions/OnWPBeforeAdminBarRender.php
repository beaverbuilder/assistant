<?php

namespace FL\Assistant\Hooks\Actions;

use FL\Assistant\Hooks\Actions\OnEnqueueScripts;
use FL\Assistant\Data\UserState;


/**
 * Class OnWPBeforeAdminBarRender
 * @package FL\Assistant\Hooks\Actions
 *
 */
class OnWPBeforeAdminBarRender {

	protected $on_enqueue_scripts;

	public function __construct( OnEnqueueScripts $on_enqueue_scripts ) {
		$this->on_enqueue_scripts = $on_enqueue_scripts;
	}

	public function __invoke() {
		global $wp_admin_bar;

		if ( ! $this->on_enqueue_scripts->should_enqueue() ) {
			return;
		}

		$state = UserState::get();
		$show_toolbar_item = false;

		if ( is_admin() ) {
			$show_toolbar_item = $state['shouldShowInAdmin'];
		} else {
			$show_toolbar_item = 'admin_bar' === $state['window']['hiddenAppearance'];
		}

		$wp_admin_bar->add_menu(
			[
				'id'    => 'fl_assistant_toggle_ui',
				'title' => __( 'Assistant', 'fl-assistant' ),
			]
		);
	}
}
