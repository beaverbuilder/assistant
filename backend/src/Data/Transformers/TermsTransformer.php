<?php


namespace FL\Assistant\Data\Transformers;

class TermsTransformer {

	public function __invoke( \WP_Term $term ) {
		return [
			'children'       => isset( $term->children ) ? $term->children : [],
			'description'    => $term->description,
			'editUrl'        => get_edit_term_link( $term->term_id, $term->taxonomy ),
			'id'             => $term->term_id,
			'isHierarchical' => is_taxonomy_hierarchical( $term->taxonomy ),
			'parent'         => $term->parent,
			'slug'           => $term->slug,
			'taxonomy'       => $term->taxonomy,
			'title'          => $term->name,
			'url'            => get_term_link( $term ),
			'count'          => $term->count,
		];
	}
}
