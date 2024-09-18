<?php

namespace FL\Assistant\Controllers\Cloud\Libraries;

use FL\Assistant\System\Contracts\ControllerAbstract;

class LibraryItemCodeController extends ControllerAbstract {

	public function register_routes() {
		$this->route(
			'/library-items/import/code', [
				[
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'import' ],
					'permission_callback' => function () {
						return current_user_can( 'edit_others_posts' );
					},
				],
			]
		);
	}

	/**
	 * Imports a code from a library to the site.
	 *
	 * @param object $request
	 * @return array
	 */
	public function import( $request ) {
		$item = $request->get_param( 'item' );

		if ( ! $item ) {
			return rest_ensure_response(
				[
					'error' => true,
				]
			);
		}

		$post_name = $item['name'];
		$description = $item['description'];
		$extension = $item['data']['extension'];
		$code = $item['data']['content'];

		if ( 'js' !== $extension && 'css' !== $extension ) {

			return rest_ensure_response( [ 'error' => __( 'Import is only allowed for CSS and JS extensions.' ) ] );
		}

		if( 'js' === $extension ) {
			$extension = 'JavaScript';
		}

		if( 'css' === $extension ) {
			$extension = 'CSS';
		}

		$new_post_id = wp_insert_post(
			[
				'post_title'     => $post_name,
				'post_type'      => 'fl_code',
				'post_author'    => wp_get_current_user()->ID,
				'post_content'   => $description,
				'post_status'    => 'publish',
				'meta_input' => [
					'_fl_asst_code_type' => $extension,
					'_fl_asst_code' => $code,
				]
			]
		);

		if ( is_wp_error( $new_post_id ) ) {
			return rest_ensure_response(
				[
					'error' => true,
				]
			);
		}

		return rest_ensure_response( [ 'success' => true ] );
	}
}
