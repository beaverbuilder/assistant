<?php


namespace FL\Assistant\Helpers;


class UserProfileHelper {
	/**
	 * Generates choices for how to display the users name on the site.
	 * Borrowed from WP Core.
	 *
	 * @return array
	 */
	public function get_public_name_display_options() {
		/**
		 * Borrowed from WordPress source code
		 */
		$public_display                     = [];
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
			$public_display = [ 'display_displayname' => $this->display_name ] + $public_display;
		}

		$public_display = array_map( 'trim', $public_display );
		$public_display = array_unique( $public_display );

		return $public_display;
	}
}
