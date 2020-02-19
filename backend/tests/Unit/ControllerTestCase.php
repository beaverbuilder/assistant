<?php


namespace FL\Assistant\Tests\Unit;

use WP_REST_Server;

class ControllerTestCase extends BaseTestCase {

	public $server;

	public function setUp() {
		parent::setUp();

		/** @var WP_REST_Server $wp_rest_server */
		global $wp_rest_server;

		$wp_rest_server = new \WP_REST_Server;
		$this->server = $wp_rest_server;
		do_action( 'rest_api_init', rest_get_server() );
	}
}
