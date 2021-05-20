<?php

namespace FL\Assistant\Hooks;

use FL\Assistant\Data\Transformers\NotationsTransformer;
use FL\Assistant\Data\Repository\NotationsRepository;
use FL\Assistant\Data\Repository\LabelsRepository;
use FL\Assistant\Data\Transformers\LabelsTransformer;

class AdminColumns {

	public function __construct() {
		add_action( 'init', [ $this, 'enqueue_custom_admin_columns' ], PHP_INT_MAX );
	}

	public function enqueue_custom_admin_columns() {
		$types = get_post_types( [ 'public' => true ], 'objects' );

		foreach ( $types as $type => $info ) {
			add_filter( "manage_{$type}_posts_columns", [ $this, 'add_columns' ] );
			add_action( "manage_{$type}_posts_custom_column", [ $this, 'render_column' ], 10, 2 );
			add_filter( "default_hidden_columns", [ $this, 'defualt_hidden_columns' ], 10, 2 );
		}
	}

	public function add_columns( $columns ) {
		$columns['fl_assistant'] = __( 'Labels', 'fl-assistant' );
		return $columns;
	}

	public function render_column( $column, $post_id ) {
		$vars = '--fl-asst-red: #FF5335; --fl-asst-blue: #1BADF8; --fl-asst-green: #00D281; --fl-asst-yellow: #FFD000; --fl-asst-orange: #FF9500; --fl-asst-purple: #CC73E1; --fl-asst-pink: #FF2968;';
		$styles = "{$vars} padding: 2px 5px; display: inline-flex; flex: 0 0 auto; border-radius: 3px; border: 1px solid #d2d2d2; align-items: center; color: black; background: white; margin: 2px 5px 3px; margin-left:0; font-size: 12px;";
		$dot = 'width: 10px; height: 10px; flex: 0 0 10px; border-radius: 7px; background: blue; margin-right: 5px;';

		if ( 'fl_assistant' === $column ) {
			$transformer = new NotationsTransformer;
			$repository = new NotationsRepository( $transformer );
			$labels = $repository->get_labels( 'post', $post_id );

			$labels_repo = new LabelsRepository;
			$labels_transformer = new LabelsTransformer( $labels_repo );
			$terms = $labels_repo->query( [ 'hide_empty' => false ] )->get_terms();

			// Assemble term meta dataset
			$term_meta = [];
			foreach ( $terms as $key => $term ) {
				$item = call_user_func( $labels_transformer, $term );
				$term_meta[ $item['id'] ] = $item;
			}

			// Output labels
			foreach ( $labels as $label ) {
				$term = $term_meta[ $label['label_id'] ];
				if ( isset( $term ) ) {
					print "<span style='{$styles}'><span style='{$dot}; background-color: {$term['color']}'></span>{$term['label']}</span>";
				}
			}
		}
	}

	/**
	 * Make our custom column hidden by default.
	 */
	public function defualt_hidden_columns( $hidden, $screen ) {
		$hidden[] = 'fl_assistant';
		return $hidden;
	}
}
