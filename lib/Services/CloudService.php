<?php


namespace FL\Assistant\Services;


class CloudService {

	const FL_CLOUD_AUTH_KEYS = 'fl-cloud-auth-keys';

	protected $config = [];

	public function __construct( array $config = [] ) {
		$this->config = $config;
	}

	public function construct_url( $path ) {
		return $this->config['cloud_url'] . $path;
	}

	/**
	 * @param $email
	 * @param $password
	 *
	 * @throws \Exception
	 */
	public function login( $email, $password ) {

		$url = esc_url_raw( $this->construct_url( '/oauth/token' ) );

		$request = [
			"body" => [
				'grant_type'    => 'password',
				'client_id'     => $this->config['client_id'],
				'client_secret' => $this->config['client_secret'],
				'username'      => $email,
				'password'      => $password,
				'scope'         => '',
			]
		];

		$response = wp_remote_post( $url, $request );

		if ( is_wp_error( $response ) ) {
			$error_message = $response->get_error_message();
			throw new \Exception( "Error logging into cloud server: {$error_message}" );
		} else {
			$response_code = wp_remote_retrieve_response_code( $response );
			if ( 200 == $response_code ) {
				$body = wp_remote_retrieve_body( $response );
				$data = json_decode( $body );
				$this->save_auth_tokens( $data );
			}
		}
	}

	public function save_auth_tokens( $data ) {

		update_option( static::FL_CLOUD_AUTH_KEYS, $data,true);

		return $this;
	}

	public function get_auth_tokens() {
		$tokens = get_option(static::FL_CLOUD_AUTH_KEYS);

		return $tokens;
	}

	public function has_auth_tokens() {
		$tokens = $this->get_auth_tokens();
		return !empty($tokens);
	}

	public function get_access_token() {
		$tokens = $this->get_auth_tokens();

		return $tokens['access_token'];
	}

	public function get_refresh_token() {
		$tokens = $this->get_auth_tokens();

		return $tokens['refresh_token'];
	}
}
