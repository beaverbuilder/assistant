<?php

namespace FL\Assistant\Helpers;

class BeaverBuilderHelper {

	/**
	 * @return bool
	 */
	public static function is_assistant_extension() {
		return  class_exists( 'FLBuilder' ) && defined( 'FL_ASSISTANT_BB_EXTENSION' ) && FL_ASSISTANT_BB_EXTENSION;
	}
}
