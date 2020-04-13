<?php

namespace FL\Assistant\Controllers;

use FL\Assistant\Data\Repository\AttachmentsRepository;
use FL\Assistant\Data\Repository\LabelsRepository;
use FL\Assistant\Data\Transformers\AttachmentTransformer;
use FL\Assistant\System\Contracts\ControllerAbstract;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;


/**
 * REST API logic for attachments.
 */
class AttachmentsController extends ControllerAbstract {


	/**
	 * @var AttachmentsRepository
	 */
	protected $attachments;

	/**
	 * @var AttachmentTransformer|callable
	 */
	protected $transformer;

	/**
	 * @var LabelsRepository
	 */
	protected $labels;

	/**
	 * AttachmentsController constructor.
	 *
	 * @param AttachmentsRepository $attachments
	 * @param AttachmentTransformer $transformer
	 */
	public function __construct(
		AttachmentsRepository $attachments,
		AttachmentTransformer $transformer,
		LabelsRepository $labels
	) {
		$this->attachments = $attachments;
		$this->transformer = $transformer;
		$this->labels = $labels;
	}

	/**
	 * Register routes.
	 */
	public function register_routes() {
		$this->route(
			'/attachments',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'index' ],
					'permission_callback' => function () {
						return current_user_can( 'edit_others_posts' );
					},
				],

			]
		);

		$this->route(
			'/attachments/upload',
			[
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'upload_media' ],
					'permission_callback' => function () {
						return current_user_can( 'edit_others_posts' );
					},
				],
			]
		);

		$this->route(
			'/attachments/count',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'count' ],
					'permission_callback' => function () {
						return current_user_can( 'edit_others_posts' );
					},
				],
			]
		);

		$this->route(
			'/attachments/(?P<id>\d+)',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'find' ],
					'args'                => [
						'id' => [
							'required' => true,
							'type'     => 'number',
						],
					],
					'permission_callback' => function () {
						return current_user_can( 'edit_others_posts' );
					},
				],
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'update' ],
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
						return current_user_can( 'edit_others_posts' );
					},
				],
				[
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => [ $this, 'delete' ],
					'args'                => [
						'id' => [
							'required' => true,
							'type'     => 'number',
						],
					],
					'permission_callback' => function () {
						return current_user_can( 'edit_others_posts' );
					},
				],
			]
		);

		$this->route(
			'/attachments/restore/(?P<id>\d+)',
			[
				[
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => [ $this, 'restore' ],
					'args'                => [
						'id' => [
							'required' => true,
							'type'     => 'number',
						],
					],
					'permission_callback' => function () {
						return current_user_can( 'edit_others_posts' );
					},
				],
			]
		);
	}

	/**
	 * Returns an array of counts by attachment type.
	 *
	 * @param WP_REST_Request $request
	 *
	 * @return mixed|WP_REST_Response
	 */
	public function count( WP_REST_Request $request ) {
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
	 * Returns an array of attachments and related data.
	 *
	 * @param WP_REST_Request $request
	 *
	 * @return mixed|WP_REST_Response
	 */
	public function index( WP_REST_Request $request ) {

		$args = $request->get_params();
		$type = isset( $args['post_mime_type'] ) ? $args['post_mime_type'] : 'all';

		switch ( $type ) {
			case 'document':
				$all_mimes = get_allowed_mime_types();
				$doc_mimes = [];
				$exclude = [ 'image', 'video', 'audio' ];

				foreach ( $all_mimes as $key => $mime ) {
					$parts = explode( '/', $mime );
					if ( in_array( $parts[0], $exclude, true ) ) {
						continue;
					}
					$doc_mimes[ $key ] = $mime;
				}

				$args['post_mime_type'] = $doc_mimes;
				break;
			case 'spreadsheets':
				$args['post_mime_type'] = 'application/vnd.apple.numbers,application/vnd.oasis.opendocument.spreadsheet,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel.sheet.macroEnabled.12,application/vnd.ms-excel.sheet.binary.macroEnabled.12';
				break;
			case 'archives':
				$args['post_mime_type'] = 'application/x-gzip,application/rar,application/x-tar,application/zip,application/x-7z-compressed';
				break;
			case 'doc':
				$args['post_mime_type'] = 'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-word.document.macroEnabled.12,application/vnd.ms-word.template.macroEnabled.12,application/vnd.oasis.opendocument.text,application/vnd.apple.pages,application/pdf,application/vnd.ms-xpsdocument,application/oxps,application/rtf,application/wordperfect,application/octet-stream';
				break;
			case 'mine':
				$args['post_author'] = 1;
				$args['post_mime_type'] = '';
				break;
			case 'all':
				$args['post_mime_type'] = '';
				break;
		}

		if ( isset( $args['label'] ) && $args['label'] ) {
			$args['post__in'] = $this->labels->get_object_ids( 'attachment', $args['label'] );
			if ( ! count( $args['post__in'] ) ) {
				$args['post__in'][] = -1; // post__in returns all posts if empty.
			}
		}

		return $this->attachments->paginate( $args )
			->apply_transform( $this->transformer )
			->to_rest_response();
	}


	/**
	 * Returns data for a single attachment.
	 *
	 * @param WP_REST_Request $request
	 *
	 * @return array|mixed
	 */
	public function find( WP_REST_Request $request ) {
		$id = $request->get_param( 'id' );

		if ( current_user_can( 'edit_post', $id ) ) {
			return $this->attachments->find( $id, $this->transformer );
		}

		// @todo: implement this on the client side.
		// return new \WP_REST_Response(["message" => "Resource not found"], 404);

		return [];
	}


	/**
	 * Updates a single attachment based on the specified action.
	 *
	 * @param WP_REST_Request $request
	 *
	 * @return mixed|WP_REST_Response
	 */
	public function update( WP_REST_Request $request ) {
		$id     = $request->get_param( 'id' );
		$action = $request->get_param( 'action' );

		if ( ! current_user_can( 'edit_post', $id ) ) {
			return rest_ensure_response( [ 'error' => true ] );
		}

		$deprecated = 'This route is deprecated. ';
		switch ( $action ) {
			case 'data':
				$data = (array) $request->get_param( 'data' );
				if ( isset( $data['meta'] ) ) {
					if ( isset( $data['meta']['alt'] ) ) {
						update_post_meta( $id, '_wp_attachment_image_alt', $data['meta']['alt'] );
					} else {
						wp_update_post(
							array_merge(
								$data,
								[
									'ID' => $id,
								]
							)
						);
					}

					unset( $data['meta'] );
				}
				wp_update_post(
					array_merge(
						$data,
						[
							'ID' => $id,
						]
					)
				);
				break;
			case 'trash':
				wp_delete_attachment( $id );
				$deprecated .= "Please use 'DELETE /attachments/delete/{id}";
				break;
			case 'untrash':
				$deprecated .= "Please use 'POST /attachments/restore/{id}";
				wp_untrash_post( $id );
				break;
		}

		$response = new WP_REST_Response( [ 'success' => true ] );

		$response->header( 'Warn', "299 {$deprecated}" );

		return $response;
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_REST_Response
	 */
	public function delete( WP_REST_Request $request ) {
		$id = $request->get_param( 'id' );

		if ( ! current_user_can( 'edit_post', $id ) ) {
			return rest_ensure_response( [ 'error' => true ] );
		}

		$this->attachments->delete( $id );

		return rest_ensure_response( [ 'success' => true ] );
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_REST_Response
	 */
	public function restore( WP_REST_Request $request ) {
		$id = $request->get_param( 'id' );

		if ( ! current_user_can( 'edit_post', $id ) ) {
			return rest_ensure_response( [ 'error' => true ] );
		}

		$attachment = $this->attachments->restore( $id, $this->transformer );

		return rest_ensure_response(
			[
				'success' => true,
				'data'    => $attachment,
			]
		);
	}
}
