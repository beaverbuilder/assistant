<?php


namespace FL\Assistant\Services\Entity;

use FL\Assistant\Util\HasEntityAttributes;

use \WP_User;

class User {

	use HasEntityAttributes;

	const FL_ASSISTANT_STATE = 'fl_assistant_state';

	/**
	 * Default state for the current user.
	 */
	public static $default_state = [
		'appOrder'           => [],
		'shouldReduceMotion' => false,
		'window'             => [],
		'appearance'         => [
			'brightness' => 'light',
		],
		'shouldShowLabels'   => true,
		'history'            => [
			'index'   => 0,
			'entries' => [],
		],
		'searchHistory'      => [],
	];

	/**
	 * @param WP_User $user
	 *
	 * @return array
	 */
	public function hydrate( WP_User $user ) {
		$date = mysql2date( get_option( 'date_format' ), $user->user_registered );

		return [
			'id'          => $user->ID,
			'content'     => get_the_author_meta( 'description', $user->ID ),
			'date'        => $date,
			'displayName' => $user->display_name,
			'editUrl'     => get_edit_user_link( $user->ID, '' ),
			'email'       => $user->user_email,
			'meta'        => $user->user_email,
			'nicename'    => $user->user_nicename,
			'thumbnail'   => get_avatar_url( $user->ID ),
			'title'       => $user->display_name,
			'url'         => get_author_posts_url( $user->ID ),
			'username'    => $user->user_login,
			'website'     => $user->user_url,
			'posts'       => count_user_posts( $user->ID, 'post' ),
			'pages'       => count_user_posts( $user->ID, 'page' ),
			'firstName'   => get_user_meta( $user->ID, 'first_name', true ),
			'lastName'    => get_user_meta( $user->ID, 'last_name', true ),
			'nickname'    => get_user_meta( $user->ID, 'nickname', true )
		];
	}


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
