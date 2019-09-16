<?php

namespace FL\Assistant\Hooks\Actions;

use FL\Assistant\Data\UserState;


/**
 * Class OnPersonalOptionsUpdate
 * @package FL\Assistant\Hooks\Actions
 *
 */
class OnPersonalOptionsUpdate {



	public function __invoke( $user_id ) {
		// check that the current user have the capability to edit the $user_id
		if ( ! current_user_can( 'edit_user', $user_id ) ) {
			return false;
		}

		$saved = get_user_meta( $user_id, UserState::FL_ASSISTANT_STATE, true );

		$window                     = $saved['window'];
		$window['hiddenAppearance'] = $_POST['fl_asst_hidden_ui'];

		$updates = [
			'shouldShowInAdmin' => boolval( $_POST['show_assistant_in_admin'] ),
			'window'            => $window,
		];

		// create/update user meta for the $user_id
		return update_user_meta(
			$user_id,
			UserState::FL_ASSISTANT_STATE,
			array_merge(
				UserState::$default_state,
				$saved ? (array) $saved : [],
				$updates
			)
		);
	}
}
