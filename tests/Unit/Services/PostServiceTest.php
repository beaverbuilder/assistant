<?php


namespace FL\Assistant\Tests\Unit\Services;

use FL\Assistant\Data\Posts;
use FL\Assistant\Tests\BaseTestCase;

class PostServiceTest extends BaseTestCase {

	public function test_can_create_instance() {
		$pd = new Posts();
		$this->assertNotNull($pd);
	}

	public function test_can_get_stati() {
		$pd = new Posts();
		$stati = $pd->get_stati();
		$this->assertIsArray($stati);
	}

	public function test_can_get_types() {
		$pd = new Posts();
		$types = $pd->get_types();
		$this->assertIsArray($types);
	}

	public function test_can_get_taxonomies() {
		$pd = new Posts();
		$tax = $pd->get_taxononies();
		$this->assertIsArray($tax);
	}
}
