<?php

namespace FL\Assistant\Controllers;

use FL\Assistant\Pagination\PostsPaginator;
use \WP_REST_Server;


/**
 * REST API logic for attachments.
 */
class AttachmentsController extends AssistantController {

	/**
	 * Register routes.
	 */
	public function register_routes() {
		$this->route(
			'/attachments', [
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'attachments' ],
					'permission_callback' => function () {
						return current_user_can( 'edit_published_posts' );
					},
				],
			]
		);

		$this->route(
			'/attachments/count', [
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'attachments_count' ],
					'permission_callback' => function () {
						return current_user_can( 'edit_published_posts' );
					},
				],
			]
		);

		$this->route(
			'/attachment/(?P<id>\d+)', [
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'attachment' ],
					'args'                => [
						'id' => [
							'required' => true,
							'type'     => 'number',
						],
					],
					'permission_callback' => function () {
						return current_user_can( 'edit_published_posts' );
					},
				],
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'update_attachment' ],
					'args'                => [
						'id'     => [
							'required' => true,
							'type'     => 'number',
						],
						'action' => [
							'required' => true,
							'type'     => 'string',
						],
					],
					'permission_callback' => function () {
						return current_user_can( 'edit_published_posts' );
					},
				],
			]
		);
	}

	/**
	 * Returns an array of response data for a single post.
	 */
	public function get_attachment_response_data( $attachment ) {
		$size  = wp_get_attachment_image_src( $attachment->ID, 'medium' );
		$meta  = wp_prepare_attachment_for_js( $attachment->ID );
		$thumb = wp_get_attachment_image_src( $attachment->ID, 'thumbnail' )[0];

		$response = [
			'alt'             => $meta['title'],
			'author'          => get_the_author_meta( 'display_name', $attachment->post_author ),
			'commentsAllowed' => 'open' === $attachment->comment_status ? true : false,
			'date'            => get_the_date( '', $attachment ),
			'description'     => $meta['description'],
			'editUrl'         => get_edit_post_link( $attachment->ID, '' ),
			'filesize'        => $meta['filesizeHumanReadable'],
			'id'              => $attachment->ID,
			'mime'            => $meta['mime'],
			'sizes'           => isset( $meta['sizes'] ) ? $meta['sizes'] : [],
			'slug'            => $attachment->post_name,
			'subtype'         => $meta['subtype'],
			'thumbnail'       => $thumb,
			'title'           => $meta['title'],
			'type'            => $meta['type'],
			'url'             => get_permalink( $attachment ),
			'urls'            => [
				'medium' => $size[0],
			],
		];

		return $response;
	}

	/**
	 * Returns an array of attachments and related data.
	 */
	public function attachments( $request ) {
		$paginator = new PostsPaginator();

		$args = array_merge(
			$request->get_params(),
			[
				// attachments have an empty post status.
				// removing this arg will give empty results
				'post_status' => 'any',
				'perm'        => 'editable',
				'post_type'   => 'attachment',
			]
		);

		$pager = $paginator->query( $args, [ $this, 'get_attachment_response_data' ] );

		return rest_ensure_response( $pager->to_array() );
	}

	/**
	 * Returns an array of counts by attachment type.
	 */
	public function attachments_count( $request ) {
		$counts   = wp_count_attachments();
		$response = [];

		foreach ( $counts as $type => $count ) {
			$parts = explode( '/', $type );
			$type  = array_shift( $parts );

			if ( isset( $response[ $type ] ) ) {
				$response[ $type ] += $count;
			} else {
				$response[ $type ] = $count;
			}
		}

		return rest_ensure_response( $response );
	}

	/**
	 * Returns data for a single attachment.
	 */
	public function attachment( $request ) {
		$id = $request->get_param( 'id' );

		if ( current_user_can( 'edit_post', $id ) ) {
			$attachment = get_post( $id );

			return $this->get_attachment_response_data( $attachment );
		}

		return [];
	}

	/**
	 * Updates a single attachment based on the specified action.
	 */
	public function update_attachment( $request ) {
		$id     = $request->get_param( 'id' );
		$action = $request->get_param( 'action' );

		if ( ! current_user_can( 'edit_post', $id ) ) {
			return rest_ensure_response( [ 'error' => true ] );
		}

		switch ( $action ) {
			case 'trash':
				wp_delete_attachment( $id );
				break;
			case 'untrash':
				wp_untrash_post( $id );
				break;
		}

		return rest_ensure_response( [ 'success' => true ] );
	}
}
