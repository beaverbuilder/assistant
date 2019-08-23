<?php

namespace FL\Assistant\Actions;

use FL\Assistant\Util\HasContainer;
use FL\Assistant\Services\Entity\User;

/**
 * Class OnEditUserProfile
 * @package FL\Assistant\Actions
 *
 */
class OnEditUserProfile {

	use HasContainer;

	public function __invoke( $user ) {

		$state  = get_user_meta( $user->ID, User::FL_ASSISTANT_STATE, true );
		$window = $state['window'];
		$view   = $this->service( 'view' );

		$view->render( 'user-profile', [
			'show_in_admin'      => $state['shouldShowInAdmin'],
			'window'             => $window,
			'hidden_appearance'  => isset( $window['hiddenAppearance'] ) ? $window['hiddenAppearance'] : '',
			'hidden_appearances' => [
				''          => __( 'Button (Default)', 'fl-assistant' ),
				'admin_bar' => __( 'Admin Bar Item', 'fl-assistant' )
			]
		] );
	}
}
