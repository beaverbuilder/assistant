<?php


namespace FL\Assistant\Tests\Unit\Data;

use FL\Assistant\Data\PostData;
use FL\Assistant\Tests\BaseTestCase;

class PostDataTest extends BaseTestCase {

	public function test_can_create() {
		$pd = new PostData();
		$this->assertNotNull($pd);
	}

	public function test_get_stati() {
		$pd = new PostData();
		$stati = $pd->get_stati();
		$this->assertIsArray($stati);
	}

	public function test_get_types() {
		$pd = new PostData();
		$types = $pd->get_types();
		$this->assertIsArray($types);
	}

	public function test_get_taxonomies() {
		$pd = new PostData();
		$tax = $pd->get_taxononies();
		$this->assertIsArray($tax);
	}
}
