<?php


namespace FL\Assistant\Tests;

use WP_UnitTestCase;
use Brain\Monkey;

class BaseTestCase extends WP_UnitTestCase {

	public function setUp() {
		parent::setUp();
		Monkey\setUp();
	}

	public function tearDown() {
		Monkey\tearDown();
		parent::tearDown();
	}

}
