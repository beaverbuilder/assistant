<?php

namespace FL\Assistant\Rest;

use FL\Assistant\Rest\Traits\HasAssistantNamespace;
use \WP_REST_Server;
use \WP_REST_Request;
use \WP_REST_Response;

/**
 * REST API logic for attachments.
 */
class AttachmentsController {

	use HasAssistantNamespace;

	/**
	 * Register routes.
	 */
	public static function register_routes() {
		static::route( '/attachments', [
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => __CLASS__ . '::attachments',
					'permission_callback' => function () {
						return current_user_can( 'edit_published_posts' );
					},
				],
			]
		);

		static::route( '/attachments/count', [
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => __CLASS__ . '::attachments_count',
					'permission_callback' => function () {
						return current_user_can( 'edit_published_posts' );
					},
				],
			]
		);

		static::route( '/attachment/(?P<id>\d+)', [
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => __CLASS__ . '::attachment',
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
					'callback'            => __CLASS__ . '::update_attachment',
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
	static public function get_attachment_response_data( $attachment ) {
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
	static public function attachments( $request ) {
		$response    = array();
		$params      = $request->get_params();
		$attachments = get_posts(
			array_merge(
				$params, array(
					'perm'      => 'editable',
					'post_type' => 'attachment',
				)
			)
		);

		foreach ( $attachments as $attachment ) {
			if ( current_user_can( 'edit_post', $attachment->ID ) ) {
				$response[] = self::get_attachment_response_data( $attachment );
			}
		}

		return rest_ensure_response( $response );
	}

	/**
	 * Returns an array of counts by attachment type.
	 */
	static public function attachments_count( $request ) {
		$counts   = wp_count_attachments();
		$response = array();

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
	static public function attachment( $request ) {
		$id = $request->get_param( 'id' );

		if ( current_user_can( 'edit_post', $id ) ) {
			$attachment = get_post( $id );

			return self::get_attachment_response_data( $attachment );
		}

		return array();
	}

	/**
	 * Updates a single attachment based on the specified action.
	 */
	static public function update_attachment( $request ) {
		$id     = $request->get_param( 'id' );
		$action = $request->get_param( 'action' );

		if ( ! current_user_can( 'edit_post', $id ) ) {
			return rest_ensure_response(
				array(
					'error' => true,
				)
			);
		}

		switch ( $action ) {
			case 'trash':
				wp_delete_attachment( $id );
				break;
			case 'untrash':
				wp_untrash_post( $id );
				break;
		}

		return rest_ensure_response(
			array(
				'success' => true,
			)
		);
	}
}
