<?php


namespace FL\Assistant\Services;


class UserService {

	const FL_ASSISTANT_STATE = "fl_assistant_state";

	/**
	 * Default state for the current user.
	 */
	public static $default_state = array(
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
	);

	/**
	 * Get the saved state for a user.
	 */
	public function get_state( $id ) {
		$saved = get_user_meta( $id, static::FL_ASSISTANT_STATE, true );

		return array_merge(
			static::$default_state,
			$saved ? (array) $saved : array()
		);
	}

	/**
	 * Update the saved state for a user.
	 */
	public function update_state( $id, $state ) {
		$saved = $this->get_state( $id );

		update_user_meta(
			$id, static::FL_ASSISTANT_STATE, array_merge(
				$saved,
				$state ? (array) $state : array()
			)
		);
	}

	/**
	 * Get the saved state for the current user.
	 */
	public function get_current_state() {
		return $this->get_state( wp_get_current_user()->ID );
	}

	/**
	 * Get info about the current user.
	 * @todo get this data without querying the rest api
	 */
	public function get_current_data() {
		$user     = wp_get_current_user();
		$request  = new \WP_REST_Request( 'GET', '/fl-assistant/v1/user/' . $user->ID );
		$response = rest_do_request( $request );

		return array_merge(
			$response->get_data(),
			array(
				'capabilities' => $user->allcaps,
			)
		);
	}

	/**
	 * Get all user roles for the site.
	 */
	public function get_roles() {
		if ( ! function_exists( 'get_editable_roles' ) ) {
			require_once( ABSPATH . 'wp-admin/includes/user.php' );
		}

		$data  = [];
		$roles = get_editable_roles();

		foreach ( $roles as $key => $role ) {
			$data[] = [
				'key'  => $key,
				'name' => $role['name'],
			];
		}

		return $data;
	}
}
