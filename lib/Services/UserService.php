<?php


namespace FL\Assistant\Services;


use FL\Assistant\Services\Entity\User;

class UserService {
	/**
	 * @return User
	 */
	public function current() {
		return $this->find( wp_get_current_user()->ID );
	}

	/**
	 * @param $id
	 *
	 * @return User
	 */
	public function find( $id ) {
		$wp_user = get_user_by( 'id', $id );

		$user = new User();
		$user->fill(
			$user->hydrate( $wp_user )
		);

		return $user;
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

	/**
	 * Returns an array of counts by user role.
	 *
	 * @return array
	 */
	public function counts_by_user_role() {

		$counts = count_users();

		$counts_by_user_role = array(
			'total' => $counts['total_users'],
		);

		foreach ( $counts['avail_roles'] as $role => $count ) {
			$counts_by_user_role[ $role ] = $count;
		}

		return $counts_by_user_role;
	}

}
