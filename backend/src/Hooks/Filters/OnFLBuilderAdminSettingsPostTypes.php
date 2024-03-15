<?php
namespace FL\Assistant\Hooks\Filters;

/**
 * Remove the code post type from the builder settings.
 */
class OnFLBuilderAdminSettingsPostTypes {
	/**
	 * @param $post_types array
	 * @return Array
	 */
	public function __invoke( $post_types ) {

		if ( isset( $post_types['fl_code'] ) ) {
			unset( $post_types['fl_code'] );
		}
		return $post_types;
	}
}
