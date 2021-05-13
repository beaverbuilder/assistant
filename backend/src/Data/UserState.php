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

	private static $frame_defaults = [
		'minWidth'        => 460,
		'maxWidth'        => 900,
		'defaultWidth'    => 520,
		'defaultOrigin'   => [ 1, 0 ],
		'breakpoint'      => 650,
	];

	/**
	 * Default state for the current user.
	 */
	protected static $default_state = [
		'appOrder'          => [],
		'window'            => [
			'origin'           => [ 1, 0 ],
			'width'            => 520,
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
		'isAppHidden'       => false,
		'shortcuts'         => [],
	];

	public static function get_default_state() {
		return static::$default_state;
	}

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
			static::get_default_state(),
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

	public static function getFrameDefaults() {
		return static::$frame_defaults;
	}

}
