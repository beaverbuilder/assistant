<?php

namespace FL\Assistant\Data\Repository;

use FL\Assistant\Data\Pager;
use FL\Assistant\System\Contracts\RepositoryAbstract;


/**
 * Class PostsRepository
 * @package FL\Assistant\Data
 */
class PostsRepository extends RepositoryAbstract {


	/**
	 * @param $id
	 * @param callable|null $transform
	 *
	 * @return array|mixed|\WP_Post|null
	 */
	public function find( $id, callable $transform = null ) {
		$post = get_post( $id );

		if ( ! is_null( $transform ) ) {
			$post = call_user_func( $transform, $post );
		}

		return $post;
	}

	/**
	 * @param array $args
	 * @param callable|null $transform
	 *
	 * @return array
	 */
	public function find_where( array $args = [], callable $transform = null ) {
		$posts = $this->query( $args )->posts;

		if ( ! is_null( $transform ) ) {
			$posts = array_map( $transform, $posts );
		}

		return $posts;
	}

	/**
	 * Return Pager object for Posts
	 *
	 * @param array $args
	 *
	 * @param callable|null $transform
	 *
	 * @return Pager
	 */
	public function paginate( array $args = [], callable $transform = null ) {
		$query = $this->query( $args );

		$pager = new Pager(
			$query->posts,
			$query->found_posts,
			$query->post_count,
			$query->get( 'offset' )
		);

		if ( ! is_null( $transform ) && $pager->total() > 0 ) {
			$pager->apply_transform( $transform );
		}

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

	public function query( array $args = [] ) {
		return new \WP_Query( $args );
	}
}
