<?php


namespace FL\Assistant\Tests\Unit\Services;


use FL\Assistant\Data\UsersRepository;
use FL\Assistant\Tests\BaseTestCase;

class UserServiceTest extends BaseTestCase {

	public function test_create_instance() {
		$ud = new UsersRepository();
		$this->assertNotNull($ud);
	}

	public function test_can_get_current_user() {
		$user_id = $this->factory->user->create();
		wp_set_current_user($user_id);

		$ud = new UsersRepository();
		$currentUser = $ud->current();
		$this->assertEquals($user_id, $currentUser->id);
	}

	public function test_can_find_user_by_id() {
		$user_id = $this->factory->user->create();
		wp_set_current_user($user_id);

		$ud = new UsersRepository();
		$user = $ud->find($user_id);
		$this->assertEquals($user_id, $user->id);
	}

	public function test_can_get_user_roles() {
		$ud = new UsersRepository();
		$roles = $ud->get_roles();
		$this->assertIsArray($roles);
	}

	public function test_can_get_counts_by_user_role() {
		$ud = new UsersRepository();
		$counts = $ud->counts_by_user_role();
		$this->assertIsArray($counts);
	}
}
