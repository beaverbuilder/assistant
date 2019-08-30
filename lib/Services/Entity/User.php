<?php


namespace FL\Assistant\Services\Entity;

use FL\Assistant\Transformers\UserTransformer;
use FL\Assistant\Util\HasEntityAttributes;

use \WP_User;

class User {

	use HasEntityAttributes;

	const FL_ASSISTANT_STATE = 'fl_assistant_state';

	public function __construct(array $data = []) {
		$this->fill($data);
	}

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
	 * Get the saved state for a user.
	 */
	public function get_state() {

		$saved = get_user_meta(
			$this->id,
			static::FL_ASSISTANT_STATE,
			true
		);

		return array_merge(
			static::$default_state,
			$saved ? (array) $saved : []
		);
	}

	/**
	 * Update the saved state for a user.
	 */
	public function update_state( array $state = [] ) {

		$saved = $this->get_state();

		update_user_meta(
			$this->id,
			static::FL_ASSISTANT_STATE,
			array_merge( $saved, $state )
		);
	}

	public function get_public_name_display_options() {
		/**
		 * Borrowed from wordpress source code
		 */
		$public_display                     = array();
		$public_display['display_nickname'] = $this->nickname;
		$public_display['display_username'] = $this->user_login;

		if ( ! empty( $this->first_name ) ) {
			$public_display['display_firstname'] = $this->first_name;
		}

		if ( ! empty( $this->last_name ) ) {
			$public_display['display_lastname'] = $this->last_name;
		}

		if ( ! empty( $this->first_name ) && ! empty( $this->last_name ) ) {
			$public_display['display_firstlast'] = $this->first_name . ' ' . $this->last_name;
			$public_display['display_lastfirst'] = $this->last_name . ' ' . $this->first_name;
		}

		if ( ! in_array( $this->display_name, $public_display ) ) { // Only add this if it isn't duplicated elsewhere
			$public_display = array( 'display_displayname' => $this->display_name ) + $public_display;
		}

		$public_display = array_map( 'trim', $public_display );
		$public_display = array_unique( $public_display );

		return $public_display;
	}

}
