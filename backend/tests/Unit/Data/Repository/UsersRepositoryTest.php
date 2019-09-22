<?php


namespace FL\Assistant\Tests\Unit\Data\Repository;


use FL\Assistant\Data\Repository\UsersRepository;
use FL\Assistant\Tests\BaseTestCase;

class UsersRepositoryTest extends BaseTestCase {

	public function test_create_instance() {
		$repo = new UsersRepository();
		$this->assertNotNull( $repo );
	}

	public function test_can_get_current_user() {
		$user_id = $this->factory->user->create();
		wp_set_current_user( $user_id );

		$repo = new UsersRepository();
		$currentUser = $repo->current();
		$this->assertEquals( $user_id, $currentUser->ID );
	}


	public function test_can_find_user_by_id() {
		$user_id = $this->factory->user->create();
		wp_set_current_user( $user_id );

		$ud = new UsersRepository();
		$user = $ud->find( $user_id );
		$this->assertEquals( $user_id, $user->ID );
	}

	public function test_can_get_user_roles() {
		$ud = new UsersRepository();
		$roles = $ud->get_roles();
		$this->assertIsArray( $roles );
	}

	public function test_can_find_many() {
		$this->factory()->user->create_many(5);
		$repo = new UsersRepository();
		$users = $repo->findWhere([]);

		var_dump($users);
		$this->assertIsArray($users);
		$this->assertIsObject($users[1]);
		$this->assertObjectHasAttribute("ID", $users[1]);
	}

	public function test_can_get_counts_by_user_role() {
		$ud = new UsersRepository();
		$counts = $ud->counts_by_user_role();
		$this->assertIsArray( $counts );
	}
}
