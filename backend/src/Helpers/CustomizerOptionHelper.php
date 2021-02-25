<?php

namespace FL\Assistant\Helpers;

/**
 * A class that extends WP_Customize_Setting so we can access
 * the protected import method when importing options.
 */
class CustomizerOptionHelper extends WP_Customize_Setting {

	/**
	 * Import a value for this setting.
	 *
	 * @param mixed $value The option value.
	 * @return void
	 */
	public function import( $value ) {
		$this->update( $value );
	}
}
