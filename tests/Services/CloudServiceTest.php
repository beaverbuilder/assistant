<?php


namespace FL\Assistant\Tests\Services;


use FL\Assistant\Tests\BaseTestCase;
use FL\Assistant\Services\CloudService;

class CloudServiceTest extends BaseTestCase {

	public $config = [];

	public function setUp() {
		parent::setUp();
		$this->config = [
			'cloud_url'     => 'http://localhost:8000',
			'client_id'     => 3,
			'client_secret' => 'r2RZp9LnMuPBrjYurRBpnLYTYz8FCxQShek21r8z'
		];
	}

	public function testLogin() {
		$cloud = new CloudService( $this->config );

		$cloud->login( 'aaron@zeek.com', 'dev' );

		$this->assertTrue($cloud->has_auth_tokens());
		$tokens = $cloud->get_auth_tokens();

		$this->assertEquals( $tokens->token_type, 'Bearer' );
		$this->assertNotNull( $tokens->access_token );
		$this->assertNotNull( $tokens->refresh_token );
	}
}
