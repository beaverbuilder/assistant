<?php

namespace FL\Assistant\Services;

use FL\Assistant\Data\Repository\PostsRepository;
use FL\Assistant\Helpers\CompanionPostsHelper;

class LibraryPostImporter {

	/**
	 * Creates a local post from a library item or an embedded companion.
	 *
	 * @param object $item
	 * @return int|\WP_Error
	 */
	public function import_item( $item ) {
		$post_data = $item->data->post;

		if ( ! in_array( $post_data->post_type, get_post_types(), true ) ) {
			return new \WP_Error(
				'post_type_not_registered',
				'Post type is not registered on this site.',
				[
					'post_type' => $post_data->post_type,
					'name'      => $post_data->post_title,
				]
			);
		}

		$new_post_id = wp_insert_post( $this->get_insert_post_args( $post_data ), true );

		if ( is_wp_error( $new_post_id ) ) {
			$new_post_id->add_data( [ 'name' => $post_data->post_title ] );
			return $new_post_id;
		}

		$this->import_meta( $new_post_id, isset( $item->data->meta ) ? $item->data->meta : null );
		$this->import_terms( $new_post_id, isset( $item->data->terms ) ? $item->data->terms : null );
		$this->regenerate_builder_cache( $new_post_id, $item );

		return $new_post_id;
	}

	/**
	 * Builds the wp_insert_post() arguments for an imported post.
	 *
	 * @param object $post_data
	 * @return array
	 */
	protected function get_insert_post_args( $post_data ) {
		// wp_insert_post() unslashes its input, which would strip the backslashes from JSON stored in post_content.
		return wp_slash(
			[
				'comment_status' => $post_data->comment_status,
				'menu_order'     => $post_data->menu_order,
				'ping_status'    => $post_data->ping_status,
				'post_author'    => wp_get_current_user()->ID,
				'post_content'   => $post_data->post_content ? $post_data->post_content : '',
				'post_excerpt'   => $post_data->post_excerpt ? $post_data->post_excerpt : '',
				'post_mime_type' => $post_data->post_mime_type ? $post_data->post_mime_type : '',
				'post_name'      => $post_data->post_name,
				'post_status'    => 'publish',
				'post_title'     => $post_data->post_title,
				'post_type'      => $post_data->post_type,
			]
		);
	}

	/**
	 * Imports the companions embedded in a library item and returns the ones that failed.
	 *
	 * @param object $item
	 * @return \WP_Error[]
	 */
	public function import_companions( $item ) {
		$errors = [];

		foreach ( CompanionPostsHelper::read( $item ) as $companion ) {
			$result = $this->import_companion( $companion );

			if ( is_wp_error( $result ) ) {
				$errors[] = $result;
			}
		}

		return $errors;
	}

	/**
	 * Imports one companion unless its post type is not library-portable or a plugin reports it present.
	 *
	 * @param object $companion
	 * @return int|\WP_Error Zero when skipped as already present.
	 */
	protected function import_companion( $companion ) {
		$post_data = $companion->data->post;

		// The entry comes from a library someone else may have authored, so it cannot pick its own post type.
		if ( ! in_array( $post_data->post_type, PostsRepository::get_library_post_types(), true ) ) {
			return new \WP_Error(
				'companion_type_not_allowed',
				'Post type cannot be imported as a companion.',
				[
					'post_type' => $post_data->post_type,
					'name'      => isset( $post_data->post_title ) ? $post_data->post_title : '',
				]
			);
		}

		if ( apply_filters( 'fl_assistant_library_companion_exists', false, $companion ) ) {
			return 0;
		}

		return $this->import_item( $companion );
	}

	/**
	 * Imports meta for a library post to the site.
	 *
	 * @param int $post_id
	 * @param object $meta
	 * @return void
	 */
	public function import_meta( $post_id, $meta ) {
		global $wpdb;

		if ( ! $meta || ! is_object( $meta ) ) {
			return;
		}

		if ( isset( $meta->_fl_builder_data ) ) {
			$meta->_fl_builder_draft = $meta->_fl_builder_data;
			$meta->_fl_builder_draft_settings = $meta->_fl_builder_data_settings;
		}

		foreach ( $meta as $meta_key => $meta_value ) {
			if ( CompanionPostsHelper::META_KEY === $meta_key ) {
				continue;
			}
			if ( metadata_exists( 'post', $post_id, $meta_key ) ) {
				delete_metadata( 'post', $post_id, $meta_key );
			}
			if ( is_array( $meta_value ) && count( $meta_value ) !== 0 ) {
				foreach ( $meta_value as $value ) {
					// $wpdb->insert() escapes for the connection; a hand-built INSERT fails under NO_BACKSLASH_ESCAPES.
					$wpdb->insert(
						$wpdb->postmeta,
						[
							'post_id'    => $post_id,
							'meta_key'   => $meta_key,
							'meta_value' => $value,
						]
					);
				}
			}
		}

		// Direct writes bypass the meta cache.
		clean_post_cache( $post_id );
	}

	/**
	 * Imports terms for a library post to the site.
	 *
	 * @param int $post_id
	 * @param array $terms
	 * @return void
	 */
	public function import_terms( $post_id, $terms ) {
		$terms = is_object( $terms ) ? [ $terms ] : $terms;

		if ( ! $terms || ! is_array( $terms ) || 0 === count( $terms ) ) {
			return;
		}

		$taxonomies = get_taxonomies( '', 'objects' );
		$taxonomy_terms = [];

		foreach ( $terms as $term ) {
			if ( ! isset( $term->name ) || ! isset( $term->taxonomy ) ) {
				continue;
			} elseif ( ! taxonomy_exists( $term->taxonomy ) ) {
				continue;
			} elseif ( ! isset( $taxonomy_terms ) ) {
				$taxonomy_terms[ $term->taxonomy ] = [];
			}

			$existing_term = term_exists( $term->slug, $term->taxonomy );
			$is_hierarchical = ! ! $taxonomies[ $term->taxonomy ]->hierarchical;

			if ( is_array( $existing_term ) ) {
				$term_id = $is_hierarchical ? $existing_term['term_taxonomy_id'] : $term->name;
			} else {
				$new_term = wp_insert_term(
					$term->name,
					$term->taxonomy,
					[
						'description' => $term->description,
						'slug'        => $term->slug,
					]
				);
				$term_id = $is_hierarchical ? $new_term['term_taxonomy_id'] : $term->name;
			}

			$taxonomy_terms[ $term->taxonomy ][] = $term_id;
		}

		foreach ( $taxonomy_terms as $taxonomy => $terms ) {
			wp_delete_object_term_relationships( $post_id, $taxonomy );
			wp_set_post_terms( $post_id, $terms, $taxonomy, true );
		}
	}

	/**
	 * Regenerate the asset cache for posts created with a builder.
	 *
	 * @param object $item
	 * @return void
	 */
	public function regenerate_builder_cache( $post_id, $item ) {
		$meta = (array) $item->data->meta;

		if ( isset( $meta['_fl_builder_data'] ) && class_exists( '\FLBuilderModel' ) ) {
			\FLBuilderModel::delete_all_asset_cache( $post_id );
		}
		if ( isset( $meta['_elementor_data'] ) && class_exists( 'Elementor\Plugin' ) ) {
			\Elementor\Plugin::$instance->files_manager->clear_cache();
		}
	}
}
