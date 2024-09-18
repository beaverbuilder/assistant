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

		if ( ! current_user_can( 'edit_others_posts' ) ) {
			return false;
		}

		$state = get_user_meta( $user->ID, UserState::FL_ASSISTANT_STATE, true );
		$state = $state ? $state : UserState::$default_state;
		$window = $state['window'];

		if ( ! apply_filters( 'fl_assistant_should_enqueue', true ) ) {
			return false;
		}

		$this->view->render(
			'user-profile', [
				'show_in_admin'      => $state['shouldShowInAdmin'],
				'window'             => $window,
				'hidden_appearance'  => isset( $window['hiddenAppearance'] ) ? $window['hiddenAppearance'] : '',
				'hidden_appearances' => [
					''          => __( 'Button (Default)', 'assistant' ),
					'admin_bar' => __( 'Admin Bar Item', 'assistant' ),
				],
			]
		);
	}
}
