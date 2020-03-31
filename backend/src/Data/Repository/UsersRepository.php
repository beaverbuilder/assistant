<?php


namespace FL\Assistant\Data\Repository;


use FL\Assistant\Data\Pager;
use FL\Assistant\System\Contracts\RepositoryAbstract;


class UsersRepository extends RepositoryAbstract {


	public function query( array $args = [], callable $transform = null ) {
		$defaults = [
			'number' => 20,
			'offset' => 0,
		];
		$args = array_merge( $defaults, $args );
		return new \WP_User_Query( $args );
	}

	/**
	 * @param $id
	 * @param callable|null $transform
	 *
	 * @return bool|mixed|\WP_User
	 */
	public function find( $id, callable $transform = null ) {

		$user = get_user_by( 'id', $id );
		if ( ! is_null( $transform ) ) {
			$user = call_user_func( $transform, $user );
		}

		return $user;
	}

	/**
	 * @param array $args
	 * @param callable|null $transform
	 *
	 * @return array
	 */
	public function find_where( array $args = [], callable $transform = null ) {
		$users = $this->query( $args )->get_results();
		if ( ! is_null( $transform ) ) {
			$users = array_map( $transform, $users );
		}
		return $users;
	}

	/**
	 * @param array $args
	 * @param callable|null $transform
	 *
	 * @return Pager
	 */
	public function paginate( array $args = [], callable $transform = null ) {
		$query = $this->query( $args );

		$pager = new Pager(
			$query->get_results(),
			$query->get_total(),
			$query->get( 'number' ),
			$query->get( 'offset' )
		);

		if ( ! is_null( $transform ) ) {
			$pager->apply_transform( $transform );
		}

		return $pager;
	}

	/**
	 * @return \WP_User
	 */
	public function current( callable $transform = null ) {
		$current_user = wp_get_current_user();
		$data = $this->find( $current_user->ID, $transform );

		if ( $transform ) {
			$data = array_merge(
				$data,
				[
					'capabilities' => $current_user->allcaps,
				]
			);
		}

		return $data;
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
