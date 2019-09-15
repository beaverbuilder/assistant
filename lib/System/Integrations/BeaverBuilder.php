<?php


namespace FL\Assistant\System\Integrations;


/**
 * Class BeaverBuilder
 *
 * @package FL\Assistant\System\Integrations
 */
class BeaverBuilder {


	/**
	 * Checks to see if beaver builder is installed
	 * @return bool
	 */
	public function is_installed() {
		return class_exists( '\FLBuilderModel' ) && class_exists( '\FLBuilderUserAccess' );
	}

	/**
	 * Checks to see if Beaver Builder can be uses to edit a post.
	 */
	public function can_edit_post( $post_id ) {
		$editable    = false;
		$post        = get_post( $post_id );
		$post_types  = \FLBuilderModel::get_post_types();
		$user_can    = current_user_can( 'edit_post', $post->ID );
		$user_access = \FLBuilderUserAccess::current_user_can( 'builder_access' );

		if ( in_array( $post->post_type, $post_types, true ) && $user_can && $user_access ) {
			$editable = true;
		}

		return (bool) apply_filters( 'fl_builder_is_post_editable', $editable );
	}
}
