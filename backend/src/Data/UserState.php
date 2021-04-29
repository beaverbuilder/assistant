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
		'appOrder'          => [],
		'window'            => [
			'origin'           => [ 1, 0 ],
			'width'            => 560,
			'isHidden'         => false,
			'hiddenAppearance' => '',
		],
		'appearance'        => [
			'brightness' => 'light',
		],
		'history'           => [
			'index'   => 0,
			'entries' => [],
		],
		'searchHistory'     => [],
		'shouldShowInAdmin' => true,
		'isAppHidden'       => true,
		'shortcuts'         => [],
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

		// Filter Window
		if ( isset( $saved['window'] ) ) {
			$window = $saved['window'];

			// Remove deprecated
			if ( isset( $window['size'] ) ) {
				unset( $window['size'] );
			}
			if ( isset( $window['overlayToolbar'] ) ) {
				unset( $window['overlayToolbar'] );
			}
			$saved['window'] = $window;
		}

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
