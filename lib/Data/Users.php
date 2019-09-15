<?php


namespace FL\Assistant\Data;


use FL\Assistant\Pagination\UsersPaginator;


class Users {

	protected $pagination_helper;
	protected $user_transformer;

	/**
	 * Users constructor.
	 *
	 * @param $pagination_helper
	 * @param $user_transformer
	 */
	public function __construct( $pagination_helper, $user_transformer ) {
		$this->pagination_helper = $pagination_helper;
		$this->user_transformer  = $user_transformer;
	}


	/**
	 * @param $args
	 *
	 * @return array
	 */
	public function paginate( $args ) {
		$pager          = $this->pagination_helper->users( $args );
		$pager["items"] = call_user_func( [ $this->user_transformer, "transform" ], $pager["items"] );

		return $pager;
	}

	/**
	 * @return \WP_User
	 */
	public function current() {
		return $this->find( wp_get_current_user()->ID );
	}

	/**
	 * @param $id
	 *
	 * @return \WP_User
	 */
	public function find( $id ) {

		$wp_user = get_user_by( 'id', $id );

		return $wp_user;
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
