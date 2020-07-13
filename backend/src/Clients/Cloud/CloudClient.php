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
		if ( ! isset( $args['method'] ) ) {
			$args['method'] = 'GET';
		}
		if ( ! isset( $args['headers'] ) ) {
			$args['headers'] = [];
		}

		$url = FL_ASSISTANT_CLOUD_URL . "/api$route";
		$token = isset( $_COOKIE['fl-cloud-token'] ) ? $_COOKIE['fl-cloud-token'] : '';
		$args['headers'][] = "Authorization: Bearer $token";
		$curl = curl_init();

		curl_setopt_array( $curl, [
			CURLOPT_URL => $url,
			CURLOPT_RETURNTRANSFER => 1,
			CURLOPT_SSL_VERIFYPEER => false,
			CURLOPT_SSL_VERIFYHOST => false,
			CURLOPT_USERAGENT => 'Assistant Plugin',
			CURLOPT_CUSTOMREQUEST => $args['method'],
			CURLOPT_HTTPHEADER => $args['headers'],
			CURLOPT_POSTFIELDS => isset( $args['data'] ) ? http_build_query( $args['data'] ) : '',
		] );

		$response = curl_exec( $curl );

		return json_decode( $response );
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
	 * @param $data array
	 * @param $args array
	 * @return object
	 */
	public function post( $route, $data = [], $args = [] ) {
		$args['method'] = 'POST';
		$args['data'] = $data;
		return $this->request( $route, $args );
	}

	/**
	 * @param $route string
	 * @param $data array
	 * @param $args array
	 * @return object
	 */
	public function put( $route, $data = [], $args = [] ) {
		$args['method'] = 'PUT';
		$args['data'] = $data;
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
