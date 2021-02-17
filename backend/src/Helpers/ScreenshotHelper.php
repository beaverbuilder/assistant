<?php

namespace FL\Assistant\Helpers;

class ScreenshotHelper {

	/**
	 * @param object $request
 	 * @param string $url
	 * @return array
	 */
	static public function get_for_request( $request, $url, $logged_in = true ) {
		$screenshot = $request->get_param( 'screenshot' );

		if ( $screenshot ) {
			return [
				'type' => 'base64',
				'data' => $screenshot,
			];
		}

		$response = wp_remote_get(
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
