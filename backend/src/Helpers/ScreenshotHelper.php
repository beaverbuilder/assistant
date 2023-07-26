<?php

namespace FL\Assistant\Helpers;

class ScreenshotHelper {

	/**
	 * @param object $request
 	 * @param string $url Fallback url.
	 * @return array
	 */
	static public function get_for_rest_request( $request, $url, $logged_in = true ) {
		$screenshot = $request->get_param( 'screenshot' );

		if ( $screenshot ) {
			return [
				'type' => 'base64',
				'data' => $screenshot,
			];
		}

		return self::get_for_url( $url, $logged_in );
	}

	/**
 	 * @param string $url Fallback url.
	 * @return array
	 */
	static public function get_for_post_request( $url, $logged_in = true ) {
		$screenshot = isset( $_POST['screenshot'] ) ? $_POST['screenshot'] : null;

		if ( $screenshot ) {
			return [
				'type' => 'base64',
				'data' => $screenshot,
			];
		}

		return self::get_for_url( $url, $logged_in );
	}

	/**
 	 * @param string $url
	 * @return array
	 */
	static public function get_for_url( $url, $logged_in = true ) {
		$response = wp_safe_remote_get(
			$url, [
				'cookies' => $logged_in ? $_COOKIE : [],
			]
		);

		return [
			'type' => 'html',
			'html' => wp_remote_retrieve_body( $response ),
		];
	}
}
