<?php

namespace FL\Assistant\Hooks\Actions;

use FL\Assistant\Data\UserState;
use FL\Assistant\Util\HasContainer;

/**
 * Class OnEditUserProfile
 * @package FL\Assistant\Hooks\Actions
 *
 */
class OnEditUserProfile {

	use HasContainer;


	public function __invoke( $user ) {

		$state  = get_user_meta( $user->ID, UserState::FL_ASSISTANT_STATE, true );
		$window = $state['window'];
		$view   = $this->service( 'view' );

		$view->render(
			'user-profile', [
				'show_in_admin'      => $state['shouldShowInAdmin'],
				'window'             => $window,
				'hidden_appearance'  => isset( $window['hiddenAppearance'] ) ? $window['hiddenAppearance'] : '',
				'hidden_appearances' => [
					''          => __( 'Button (Default)', 'fl-assistant' ),
					'admin_bar' => __( 'Admin Bar Item', 'fl-assistant' ),
				],
			]
		);
	}
}
