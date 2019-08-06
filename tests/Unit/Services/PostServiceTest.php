<?php


namespace FL\Assistant\Tests\Unit\Services;

use FL\Assistant\Services\PostService;
use FL\Assistant\Tests\BaseTestCase;

class PostServiceTest extends BaseTestCase {

	public function test_can_create_instance() {
		$pd = new PostService();
		$this->assertNotNull($pd);
	}

	public function test_can_get_stati() {
		$pd = new PostService();
		$stati = $pd->get_stati();
		$this->assertIsArray($stati);
	}

	public function test_can_get_types() {
		$pd = new PostService();
		$types = $pd->get_types();
		$this->assertIsArray($types);
	}

	public function test_can_get_taxonomies() {
		$pd = new PostService();
		$tax = $pd->get_taxononies();
		$this->assertIsArray($tax);
	}
}
