<?php

namespace FL\Assistant\Helpers;

class JsonHelper {

	/**
	 * @param string $string
	 * @return bool
	 */
	public static function is_string_json( $string ) {
		$decoded = json_decode( $string );

		return is_object( $decoded ) || is_array( $decoded );
	}
}
