<?php


namespace FL\Assistant\Tests\Unit\Data;

use FL\Assistant\Data\Repository\PostsRepository;
use FL\Assistant\Tests\BaseTestCase;

class PostRepositoryTest extends BaseTestCase {

	public function test_can_create_instance() {
		$pd = new PostsRepository();
		$this->assertNotNull($pd);
	}

	public function test_can_get_stati() {
		$pd = new PostsRepository();
		$stati = $pd->get_stati();
		$this->assertIsArray($stati);
	}

	public function test_can_get_types() {
		$pd = new PostsRepository();
		$types = $pd->get_types();
		$this->assertIsArray($types);
	}

	public function test_can_get_taxonomies() {
		$pd = new PostsRepository();
		$tax = $pd->get_taxononies();
		$this->assertIsArray($tax);
	}
}
