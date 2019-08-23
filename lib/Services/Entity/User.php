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
		'window'             => [
			'origin' => [1,0],
			'size' => 'mini',
			'isHidden' => false,
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
		'shouldShowInAdmin' => true,
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

}
