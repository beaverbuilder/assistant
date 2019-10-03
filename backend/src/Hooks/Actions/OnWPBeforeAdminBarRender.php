<?php

namespace FL\Assistant\Hooks\Actions;

use FL\Assistant\Data\UserState;


/**
 * Class OnWPBeforeAdminBarRender
 * @package FL\Assistant\Hooks\Actions
 *
 */
class OnWPBeforeAdminBarRender {

	public function __invoke() {
		global $wp_admin_bar;

		$state = UserState::get();
		$show_toolbar_item = false;

		if ( is_admin() ) {
			$show_toolbar_item = $state['shouldShowInAdmin'];
		} else {
			$show_toolbar_item = 'admin_bar' === $state['window']['hiddenAppearance'];
		}

		if ( $show_toolbar_item ) {
			$wp_admin_bar->add_menu( [
				'id'    => 'fl_assistant_toggle_ui',
				'title' => __( 'Assistant', 'fl-assistant' ),
			] );
		}
	}
}
