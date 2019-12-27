<?php
namespace FL\Assistant\Controllers;
use FL\Assistant\Data\Repository\CommentsRepository;
use FL\Assistant\Data\Repository\PostsRepository;
use FL\Assistant\Data\Transformers\CommentTransformer;
use FL\Assistant\System\Contracts\ControllerAbstract;
use WP_REST_Server;

/**0
 * REST API logic for comments.
 */
class CommentsController extends ControllerAbstract {


	protected $posts;

	protected $comments;

	protected $transformer;

	public function __construct(
		PostsRepository $posts,
		CommentsRepository $comments,
		CommentTransformer $transformer
	) {
		$this->posts       = $posts;
		$this->comments    = $comments;
		$this->transformer = $transformer;
	}

	/**
	 * Register routes.
	 */
	public function register_routes() {
		$this->route(
			'/comments',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'index' ],
					'permission_callback' => function () {
						return current_user_can( 'moderate_comments' );
					},
				],
			]
		);

		$this->route(
			'/comments/count',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'comments_count' ],
					'permission_callback' => function () {
						return current_user_can( 'moderate_comments' );
					},
				],
			]
		);

		$this->route(
			'/comments/(?P<id>\d+)',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'read' ],
					'args'                => [
						'id' => [
							'required' => true,
							'type'     => 'number',
						],
					],
					'permission_callback' => function () {
						return current_user_can( 'moderate_comments' );
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
						return current_user_can( 'moderate_comments' );
					},
				],
			]
		);
	}

	/**
	 * Returns an array of comments and related data.
	 */
	public function index( $request ) {
		$params = $request->get_params();

		$post_types = array_keys( $this->posts->get_types() );
		$args       = array_merge( [ 'post_type' => $post_types ], $params );

		return $this->comments->paginate( $args )
			->apply_transform( $this->transformer )
			->to_rest_response();
	}

	/**
	 * Returns the number of comments found given
	 * the current args.
	 */
	public function comments_count( $request ) {
		$counts = wp_count_comments();

		return rest_ensure_response(
			[
				'approved' => $counts->approved,
				'pending'  => $counts->moderated,
				'spam'     => $counts->spam,
				'trash'    => $counts->trash,
				'total'    => $counts->total_comments,
			]
		);
	}

	/**
	 * Returns data for a single comment.
	 */
	public function read( $request ) {
		$id       = $request->get_param( 'id' );
		$comment  = $this->comments->find( $id, $this->transformer );

		return rest_ensure_response( $comment );
	}

	/**
	 * Updates a single comment based on the specified action.
	 */
	public function update( $request ) {
		$id      = $request->get_param( 'id' );
		$action  = $request->get_param( 'action' );
		$comment = get_comment( $id );
		$data = $request->get_param( 'data' );

		switch ( $action ) {
			case 'approve':
				wp_set_comment_status( $comment, 'approve' );
				break;
			case 'unapprove':
				wp_set_comment_status( $comment, 'hold' );
				break;
			case 'spam':
				wp_spam_comment( $comment );
				break;
			case 'unspam':
				wp_unspam_comment( $comment );
				break;
			case 'trash':
				if ( ! EMPTY_TRASH_DAYS ) {
					wp_delete_comment( $comment );
				} else {
					wp_trash_comment( $comment );
				}
				break;
			case 'untrash':
				wp_untrash_comment( $comment );
				break;
			case 'content':
				wp_update_comment(
					[
						'comment_ID'      => $id,
						'comment_content' => $data['content'],
					]
				);
				break;
		}
		$comment = get_comment( $id );
		return rest_ensure_response(
			[
				'success'     => true,
				'commentData' => $comment,
			]
		);
	}
}
