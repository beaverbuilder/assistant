<?php


namespace FL\Assistant\Tests\Unit\Core;

use FL\Assistant\Core\Container;
use FL\Assistant\Tests\BaseTestCase;

class FakeService {

}

class ContainerTest extends BaseTestCase {

	public function test_create_instance() {
		$expected  = "FL\Assistant\Core\Container";
		$container = Container::instance();

		$this->assertEquals( get_class( $container ), $expected );
	}

	public function test_can_create_service() {
		$container = Container::instance();
		$container->register_service( 'fakeService', function () {
			return new FakeService();
		} );

		$service = $container->service( 'fakeService' );
		$this->assertInstanceOf( FakeService::class, $service );
	}

	public function test_can_get_set_config_keys() {
		$expected  = 'bar';
		$container = Container::instance();
		$container->set( 'foo', $expected );
		$actual = $container->get( 'foo' );
		$this->assertEquals( $expected, $actual );
	}
}
