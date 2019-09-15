<?php

namespace FL\Assistant\Data;

use FL\Assistant\Helpers\PaginationHelper;
use FL\Assistant\RestApi\Transformers\PostTransformer;


class Posts {

	/**
	 * @var PaginationHelper
	 */
	protected $pagination_helper;

	/**
	 * @var PostTransformer
	 */
	protected $transformer;

	/**
	 * Posts constructor.
	 *
	 * @param PaginationHelper $pagination_helper
	 * @param PostTransformer $transformer
	 */
	public function __construct( PaginationHelper $pagination_helper, PostTransformer $transformer ) {
		$this->pagination_helper = $pagination_helper;
		$this->transformer       = $transformer;
	}

	/**
	 * Return Pager object for Posts
	 *
	 * @param array $args
	 *
	 * @return array
	 */
	public function paginate( array $args = [] ) {
		$pager          = $this->pagination_helper->posts( $args );
		$pager['items'] = call_user_func( [ $this->transformer, "transform" ], $pager["items"] );

		return $pager;
	}

	/**
	 * Get post status slugs and names.
	 * @return array
	 */
	public function get_stati() {
		$data  = [];
		$stati = get_post_stati( [], 'objects' );

		foreach ( $stati as $slug => $status ) {
			$data[ $slug ] = esc_html( $status->label );
		}

		return $data;
	}

	/**
	 * Get array of post types registered in WordPress
	 * @return array
	 */
	public function get_types() {
		$data  = [];
		$types = get_post_types(
			[
				'public' => true,
			],
			'objects'
		);

		foreach ( $types as $slug => $type ) {
			if ( ! isset( $type->cap->edit_published_posts ) ) {
				continue;
			}
			if ( ! current_user_can( $type->cap->edit_published_posts ) ) {
				continue;
			}
			if ( 'attachment' === $slug ) {
				continue;
			}
			$data[ $slug ] = [
				'canExport'      => $type->can_export,
				'hasArchive'     => $type->has_archive,
				'isHierarchical' => $type->hierarchical,
				'supports'       => [
					'excerpt' => post_type_supports( $slug, 'excerpt' ),
				],
				'labels'         => [
					'singular' => esc_html( $type->labels->singular_name ),
					'plural'   => esc_html( $type->labels->name ),
					'newItem'  => esc_html( $type->labels->new_item ),
					'editItem' => esc_html( $type->labels->edit_item ),
				],
			];
		}

		return $data;
	}

	/**
	 * Get taxonomy slugs and names.
	 */
	public function get_taxononies() {
		$data  = [];
		$types = static::get_types();

		foreach ( $types as $type_slug => $type ) {
			$taxonomies = get_object_taxonomies( $type_slug, 'objects' );
			foreach ( $taxonomies as $taxonomy_slug => $taxonomy ) {
				if ( ! $taxonomy->public || ! $taxonomy->show_ui || 'post_format' === $taxonomy_slug ) {
					continue;
				}
				$data[ $taxonomy_slug ] = [
					'description'    => $taxonomy->description,
					'isHierarchical' => $taxonomy->hierarchical,
					'labels'         => [
						'singular'   => esc_html( $taxonomy->labels->singular_name ),
						'plural'     => esc_html( $taxonomy->labels->name ),
						'newItem'    => sprintf( esc_html_x( 'New %s', 'Singular term name.', 'fl-assistant' ), $taxonomy->labels->singular_name ),
						'addNewItem' => esc_html( $taxonomy->labels->add_new_item ),
						'editItem'   => esc_html( $taxonomy->labels->edit_item ),
					],
				];
			}
		}

		return $data;
	}
}
