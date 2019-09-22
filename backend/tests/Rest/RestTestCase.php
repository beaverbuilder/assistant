<?php


namespace FL\Assistant\Tests\Rest;


use FL\Assistant\Tests\BaseTestCase;

class RestTestCase extends BaseTestCase {

	public $server;

	public function setUp() {
		parent::setUp();

		/** @var WP_REST_Server $wp_rest_server */
		global $wp_rest_server;
		$this->server = $wp_rest_server = new \WP_REST_Server;
		do_action( 'rest_api_init' );
	}
}
