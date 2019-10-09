<?php

namespace FL\Assistant\Hooks\Actions;

use FL\Assistant\Data\UserState;
use FL\Assistant\System\View;
/**
 * Class OnEditUserProfile
 * @package FL\Assistant\Hooks\Actions
 *
 */
class OnEditUserProfile {

	/**
	 * @var View
	 */
	protected $view;

	/**
	 * OnEditUserProfile constructor.
	 *
	 * @param View $view
	 */
	public function __construct( View $view ) {
		$this->view = $view;
	}


	/**
	 * @param $user
	 */
	public function __invoke( $user ) {

		$state = get_user_meta( $user->ID, UserState::FL_ASSISTANT_STATE, true );
		$state = $state ? $state : UserState::$default_state;
		$window = $state['window'];

		$this->view->render(
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
