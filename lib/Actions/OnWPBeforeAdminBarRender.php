<?php

namespace FL\Assistant\Actions;

use FL\Assistant\Util\HasContainer;
use FL\Assistant\Services\Entity\User;

/**
 * Class OnWPBeforeAdminBarRender
 * @package FL\Assistant\Actions
 *
 */
class OnWPBeforeAdminBarRender {

	use HasContainer;

    public function __invoke() {
        global $wp_admin_bar;

        $users      = $this->container()->service( 'users' );
		$state = $users->current()->get_state();
        $show_toolbar_item = 'admin_bar' === $state['window']['hiddenAppearance'];

        if ( is_admin() && ! $state['shouldShowInAdmin'] ) return;

        if ( $show_toolbar_item ) {
            $args = array(
                'id'     => 'fl_assistant_toggle_ui',
                'title'  => __( 'Assistant', 'fl-assistant' ),
            );
            $wp_admin_bar->add_menu( $args );
        }
	}
}
