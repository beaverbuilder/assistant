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
		$state = get_user_meta( $user->ID, User::FL_ASSISTANT_STATE, true );

		$this->service( 'view' )
		     ->render( 'user-profile', [
			     'show_in_admin' => $state['shouldShowInAdmin'],
		     ] );
	}
}
