<?php

namespace FL\Assistant\Actions;

use FL\Assistant\Util\HasContainer;
use FL\Assistant\Services\Entity\User;

/**
 * Class OnPersonalOptionsUpdate
 * @package FL\Assistant\Actions
 *
 */
class OnPersonalOptionsUpdate {

	use HasContainer;

	public function __invoke( $user_id ) {
		// check that the current user have the capability to edit the $user_id
		if ( ! current_user_can( 'edit_user', $user_id ) ) {
			return false;
		}

		$saved = get_user_meta( $user_id, User::FL_ASSISTANT_STATE, true );

		$window                     = $saved['window'];
		$window['hiddenAppearance'] = $_POST['fl_asst_hidden_ui'];

		$updates = [
			'shouldShowInAdmin' => boolval( $_POST['show_assistant_in_admin'] ),
			'window'            => $window,
		];

		// create/update user meta for the $user_id
		return update_user_meta(
			$user_id,
			User::FL_ASSISTANT_STATE,
			array_merge(
				User::$default_state,
				$saved ? (array) $saved : [],
				$updates
			)
		);
	}
}
