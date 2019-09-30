<?php
namespace FL\Assistant\Tests\Unit;

use WP_UnitTestCase;

/**
 * Class BaseTestCase
 * @package FL\Assistant\Tests
 */
class BaseTestCase extends WP_UnitTestCase {

	public function setUp() {
		parent::setUp();
//		Monkey\setUp();
	}

	public function tearDown() {
//		Monkey\tearDown();
		parent::tearDown();
	}

	public function assertIsPager( $data ) {
		$this->assertIsArray( $data );
		$this->assertIsArray( $data['items'] );
		$this->assertNotNull( $data['items_count'] );
		$this->assertNotNull( $data['items_per_page'] );
		$this->assertNotNull( $data['current_page'] );
		$this->assertNotNull( $data['first_page'] );
		$this->assertNotNull( $data['last_page'] );
		$this->assertNotNull( $data['has_more'] );
	}
}
