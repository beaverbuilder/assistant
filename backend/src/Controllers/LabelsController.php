<?php

namespace FL\Assistant\Controllers;

use FL\Assistant\Data\Repository\LabelsRepository;
use FL\Assistant\Data\Transformers\LabelsTransformer;
use FL\Assistant\System\Contracts\ControllerAbstract;
use WP_REST_Server;

/**
 * REST API logic for notation labels.
 */
class LabelsController extends ControllerAbstract {

	/**
	 * @var LabelsRepository
	 */
	protected $labels;
	protected $transformer;

	/**
	 * LabelsController constructor.
	 *
	 * @param LabelsRepository $labels
	 */
	public function __construct( LabelsRepository $labels, LabelsTransformer $transformer ) {
		$this->labels = $labels;
		$this->transformer = $transformer;
	}

	/**
	 * Register routes.
	 */
	public function register_routes() {
		$this->route(
			'/labels', [
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_labels' ],
					'permission_callback' => function () {
						return current_user_can( 'edit_others_posts' );
					},
				],
			]
		);

		$this->route(
			'/labels/count',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'label_counts' ],
					'permission_callback' => function () {
						return current_user_can( 'edit_others_posts' );
					},
				],
			]
		);
	}

	/**
	 * Returns all labels.
	 *
	 * @param \WP_REST_Request $request
	 *
	 * @return mixed|\WP_REST_Response
	 */
	public function get_labels( \WP_REST_Request $request ) {
		$response = [];
		$terms = $this->labels->query(
			[
				'hide_empty' => false,
			]
		)->get_terms();

		foreach ( $terms as $term ) {
			$response[] = call_user_func( $this->transformer, $term );
		}

		return rest_ensure_response( $response );
	}

	/**
	 * Returns an array of counts by label ID.
	 */
	public function label_counts( $request ) {
		return rest_ensure_response( $this->labels->count() );
	}
}
