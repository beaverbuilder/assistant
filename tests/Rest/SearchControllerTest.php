<?php


namespace FL\Assistant\Tests\Rest;


class SearchControllerTest extends RestTestCase {

	public function test_can_search() {
		wp_set_current_user( 1 );

		$this->factory->post->create( array( 'post_title' => 'Test Post 1' ) );
		$this->factory->post->create( array( 'post_title' => 'Test Post 2' ) );
		$this->factory->post->create( array( 'post_title' => 'Test Post 3' ) );

		$this->factory->user->create( [
			'user_login'    => 'test-user-1',
			'user_email'    => 'test-user-1@gmail.com',
			'user_nicename' => 'Test User 1'
		] );

		$this->factory->user->create( [
			'user_login'    => 'test-user-2',
			'user_email'    => 'test-user-2@gmail.com',
			'user_nicename' => 'Test User 2'
		] );

		// @todo create some test comments and media attachments

		$request = new \WP_REST_Request( 'POST', '/fl-assistant/v1/search' );
		$request->set_body_params( [
			"routes" => [
				"/fl-assistant/v1/users?search=*test*",
				"/fl-assistant/v1/comments?search=test",
				"/fl-assistant/v1/attachments?s=test",
				"/fl-assistant/v1/posts?post_type=any&s=test"
			]
		] );

		$response = $this->server->dispatch( $request );

		$this->assertEquals( 200, $response->get_status() );
		$data = $response->get_data();

		// This is not extremely thorough in testing the expected output.
		$this->assertIsArray($data);
		$this->assertIsArray($data[0]);
		$this->assertIsArray($data[0][0]);
		$this->assertArrayHasKey('id', $data[0][0]);
		$this->assertTrue(is_numeric($data[0][0]['id']));
	}
}
