<?php

namespace FL\Assistant\Clients\Cloud;

class CloudClient {

	/**
	 * @var CloudLibraries
	 */
	public $libraries;

	/**
	 * @return void
	 */
	public function __construct() {
		$this->libraries = new CloudLibraries( $this );
	}

	/**
	 * @param $route string
	 * @param $args array
	 * @return object
	 */
	public function request( $route, $args = [] ) {
		$url = FL_ASSISTANT_CLOUD_URL . "/api$route";
		$token = isset( $_COOKIE['fl-cloud-token'] ) ? $_COOKIE['fl-cloud-token'] : '';

		if ( ! isset( $args['headers'] ) ) {
			$args['headers'] = [];
		}

		$args['headers']['Authorization'] = "Bearer $token";
		$args['sslverify'] = false;

		$response = wp_remote_request( $url, $args );
		$body = wp_remote_retrieve_body( $response );

		return json_decode( $body );
	}

	/**
	 * @param $route string
	 * @param $args array
	 * @return object
	 */
	public function get( $route, $args = [] ) {
		$args['method'] = 'GET';
		return $this->request( $route, $args );
	}

	/**
	 * @param $route string
	 * @param $args array
	 * @return object
	 */
	public function post( $route, $args = [] ) {
		$args['method'] = 'POST';
		return $this->request( $route, $args );
	}

	/**
	 * @param $route string
	 * @param $args array
	 * @return object
	 */
	public function put( $route, $args = [] ) {
		$args['method'] = 'PUT';
		return $this->request( $route, $args );
	}

	/**
	 * @param $route string
	 * @param $args array
	 * @return object
	 */
	public function delete( $route, $args = [] ) {
		$args['method'] = 'DELETE';
		return $this->request( $route, $args );
	}
}
