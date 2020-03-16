<?php


namespace FL\Assistant\Data;


/**
 * Class UserState
 * @package FL\Assistant\Data
 */
class UserState {

	/**
	 * Storage key for user meta
	 */
	const FL_ASSISTANT_STATE = 'fl_assistant_state';

	/**
	 * Default state for the current user.
	 */
	public static $default_state = [
		'appOrder'           => [],
		'window'             => [
			'origin'           => [ 1, 0 ],
			'size'             => 'mini',
			'isHidden'         => false,
			'hiddenAppearance' => '',
			'overlayToolbar'  => false,
		],
		'appearance'         => [
			'brightness' => 'light',
		],
		'history'            => [
			'index'   => 0,
			'entries' => [],
		],
		'searchHistory'      => [],
		'shouldReduceMotion' => false,
		'shouldShowLabels'   => true,
		'shouldShowInAdmin'  => true,
	];

	/**
	 * Get the saved state for the current user.
	 */
	public static function get() {

		$saved = get_user_meta(
			wp_get_current_user()->ID,
			static::FL_ASSISTANT_STATE,
			true
		);

		return array_replace_recursive(
			static::$default_state,
			$saved ? (array) $saved : []
		);
	}

	/**
	 * Update the saved state for the current user
	 */
	public static function update( array $state = [] ) {

		$saved = static::get();

		update_user_meta(
			wp_get_current_user()->ID,
			static::FL_ASSISTANT_STATE,
			array_merge( $saved, $state )
		);
	}

}
