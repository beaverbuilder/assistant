<?php

namespace FL\Assistant\Controllers;

use FL\Assistant\Data\Repository\AttachmentsRepository;
use FL\Assistant\Data\Transformers\AttachmentTransform;
use FL\Assistant\System\Contracts\ControllerAbstract;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;


/**
 * REST API logic for attachments.
 */
class AttachmentsController extends ControllerAbstract
{

	/**
	 * @var AttachmentsRepository
	 */
	protected $attachments;

	/**
	 * @var AttachmentTransform|callable
	 */
	protected $transformer;

	/**
	 * AttachmentsController constructor.
	 *
	 * @param AttachmentsRepository $attachments
	 * @param AttachmentTransform $transformer
	 */
	public function __construct(AttachmentsRepository $attachments, AttachmentTransform $transformer)
	{
		$this->attachments = $attachments;
		$this->transformer = $transformer;
	}

	/**
	 * Register routes.
	 */
	public function register_routes()
	{
		$this->route(
			'/attachments',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [$this, 'index'],
					'permission_callback' => function () {
						return current_user_can('edit_published_posts');
					},
				],

			]
		);

		$this->route(
			'/attachments/upload',
			[
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [$this, 'upload_media'],
					'permission_callback' => function () {
						return current_user_can('edit_published_posts');
					},
				],
			]
		);

		$this->route(
			'/attachments/count',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [$this, 'count'],
					'permission_callback' => function () {
						return current_user_can('edit_published_posts');
					},
				],
			]
		);

		$this->route(
			'/attachments/(?P<id>\d+)',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [$this, 'find'],
					'args'                => [
						'id' => [
							'required' => true,
							'type'     => 'number',
						],
					],
					'permission_callback' => function () {
						return current_user_can('edit_published_posts');
					},
				],
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [$this, 'update'],
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
						return current_user_can('edit_published_posts');
					},
				],
				[
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => [$this, 'delete'],
					'args'                => [
						'id' => [
							'required' => true,
							'type'     => 'number',
						],
					],
					'permission_callback' => function () {
						return current_user_can('edit_published_posts');
					},
				],
			]
		);

		$this->route(
			'/attachments/restore/(?P<id>\d+)',
			[
				[
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => [$this, 'restore'],
					'args'                => [
						'id' => [
							'required' => true,
							'type'     => 'number',
						],
					],
					'permission_callback' => function () {
						return current_user_can('edit_published_posts');
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
	public function count(WP_REST_Request $request)
	{
		$counts   = wp_count_attachments();
		$response = [];

		foreach ($counts as $type => $count) {
			$parts = explode('/', $type);
			$type  = array_shift($parts);

			if (isset($response[$type])) {
				$response[$type] += $count;
			} else {
				$response[$type] = $count;
			}
		}

		return rest_ensure_response($response);
	}

	/**
	 * Returns an array of attachments and related data.
	 *
	 * @param WP_REST_Request $request
	 *
	 * @return mixed|WP_REST_Response
	 */
	public function index(WP_REST_Request $request)
	{

		$args = $request->get_params();

		switch ($args['post_mime_type']) {
			case 'spreadsheets':
				$args['post_mime_type'] = 'pplication/vnd.apple.numbers,application/vnd.oasis.opendocument.spreadsheet,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel.sheet.macroEnabled.12,application/vnd.ms-excel.sheet.binary.macroEnabled.12';
				break;
			case 'archives':
				$args['post_mime_type'] = 'application/x-gzip,application/rar,application/x-tar,application/zip,application/x-7z-compressed';
				break;
			case 'document':
				$args['post_mime_type'] = 'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-word.document.macroEnabled.12,application/vnd.ms-word.template.macroEnabled.12,application/vnd.oasis.opendocument.text,application/vnd.apple.pages,application/pdf,application/vnd.ms-xpsdocument,application/oxps,application/rtf,application/wordperfect,application/octet-stream';
				break;
			case 'mine':
				$args['post_author'] = 1;
				$args['post_mime_type'] = '';
				break;
			case 'detached':
				$args['post_parent'] = 0;
				$args['post_mime_type'] = '';
				break;
			case 'all':
				$args['post_mime_type'] = '';
				break;
		}

		return $this->attachments->paginate($args)
			->apply_transform($this->transformer)
			->to_rest_response();
	}


	/**
	 * Returns data for a single attachment.
	 *
	 * @param WP_REST_Request $request
	 *
	 * @return array|mixed
	 */
	public function find(WP_REST_Request $request)
	{
		$id = $request->get_param('id');

		if (current_user_can('edit_post', $id)) {
			return $this->attachments->find($id, $this->transformer);
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
	public function update(WP_REST_Request $request)
	{
		$id     = $request->get_param('id');
		$action = $request->get_param('action');

		if (!current_user_can('edit_post', $id)) {
			return rest_ensure_response(['error' => true]);
		}

		$deprecated = 'This route is deprecated. ';
		switch ($action) {
			case 'trash':
				wp_delete_attachment($id);
				$deprecated .= "Please use 'DELETE /attachments/delete/{id}";
				break;
			case 'untrash':
				$deprecated .= "Please use 'POST /attachments/restore/{id}";
				wp_untrash_post($id);
				break;
		}

		$response = new WP_REST_Response(['success' => true]);

		$response->header('Warn', "299 {$deprecated}");

		return $response;
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_REST_Response
	 */
	public function delete(WP_REST_Request $request)
	{
		$id = $request->get_param('id');

		if (!current_user_can('edit_post', $id)) {
			return rest_ensure_response(['error' => true]);
		}

		$this->attachments->delete($id);

		return rest_ensure_response(['success' => true]);
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_REST_Response
	 */
	public function restore(WP_REST_Request $request)
	{
		$id = $request->get_param('id');

		if (!current_user_can('edit_post', $id)) {
			return rest_ensure_response(['error' => true]);
		}

		$attachment = $this->attachments->restore($id, $this->transformer);

		return rest_ensure_response(
			[
				'success' => true,
				'data'    => $attachment,
			]
		);
	}


	/**
	 * Creates a single post.
	 */
	public function upload_media($request)
	{
		$data = $request->get_params();
print_r($data);
exit;
	}
}
