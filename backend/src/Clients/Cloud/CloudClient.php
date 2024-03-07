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

		$token_key = 'fl-cloud-token-' . md5( home_url() );
		$token = isset( $_COOKIE[ $token_key ] ) ? $_COOKIE[ $token_key ] : '';

		$args['headers']['Authorization'] = "Bearer $token";
		$args['body'] = isset( $args['data'] ) ? $this->build_query( $args['data'] ) : '';
		$args['sslverify'] = false;
		$args['user-agent'] = 'Assistant Plugin';

		$response = CloudRequest::request( FL_ASSISTANT_CLOUD_URL . "/api$route", $args );

		if ( is_wp_error( $response ) ) {
			return null;
		}

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

	/**
	 * @param $data array
	 * @param $prefix string
	 * @return array
	 */
	protected function build_query( $data, $prefix = null ) {
		$query = [];

		foreach ( $data as $key => $value ) {
			$new_key = $prefix ? "{$prefix}[{$key}]" : $key;
			if (
				$value instanceof CURLFile ||	
				$value instanceof CloudFile
			) {	
				$query[ $new_key ] = $value;
			} elseif ( is_array( $value ) || is_object( $value ) ) {
				$query += $this->build_query( $value, $new_key );
			} else {
				$query[ $new_key ] = $value;
			}
		}

		return $query;
	}
}
