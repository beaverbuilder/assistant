<?php


namespace FL\Assistant\Tests;

use WP_UnitTestCase;
use Brain\Monkey;

/**
 * Class BaseTestCase
 * @package FL\Assistant\Tests
 */
class BaseTestCase extends \WP_UnitTestCase {

	public function setUp() {
		parent::setUp();
		Monkey\setUp();
	}

	public function tearDown() {
		Monkey\tearDown();
		parent::tearDown();
	}

}
