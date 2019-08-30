<?php


namespace FL\Assistant\Services;


use FL\Assistant\Pagination\UsersPaginator;
use FL\Assistant\Services\Entity\User;
use FL\Assistant\Transformers\UserTransformer;
use FL\Assistant\Util\HasContainer;

class UserService {

	use HasContainer;

	/**
	 * @param $args
	 *
	 * @return UsersPaginator
	 */
	public function paginate( $args ) {
		$paginator   = new UsersPaginator();
		$transformer = new UserTransformer( $this->container() );
		$pager       = $paginator->query( $args, $transformer );

		return $pager;
	}

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

		$transformer = new UserTransformer( $this->container() );
		$wp_user = get_user_by( 'id', $id );
		$user    = new User( $transformer->transform( $wp_user ) );

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

		$counts_by_user_role = [
			'total' => $counts['total_users'],
		];

		foreach ( $counts['avail_roles'] as $role => $count ) {
			$counts_by_user_role[ $role ] = $count;
		}

		return $counts_by_user_role;
	}

}
