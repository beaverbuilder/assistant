<?php


namespace FL\Assistant\Tests\Unit\Data;


use FL\Assistant\Data\UserData;
use FL\Assistant\Tests\BaseTestCase;

class UserDataTest extends BaseTestCase {

	public function test_create() {
		$ud = new UserData();
		$this->assertNotNull($ud);
	}

	public function test_get_current() {
		$user_id = $this->factory->user->create();
		wp_set_current_user($user_id);

		$ud = new UserData();
		$currentUser = $ud->current();
		$this->assertEquals($user_id, $currentUser->id);
	}

	public function test_find() {
		$user_id = $this->factory->user->create();
		wp_set_current_user($user_id);

		$ud = new UserData();
		$user = $ud->find($user_id);
		$this->assertEquals($user_id, $user->id);
	}

	public function test_get_roles() {
		$ud = new UserData();
		$roles = $ud->get_roles();

		var_dump($roles);

		$this->assertIsArray($roles);
	}

	public function test_counts_by_user_role() {
		$ud = new UserData();
		$counts = $ud->counts_by_user_role();

		var_dump($counts);

		$this->assertIsArray($counts);
	}
}
