<?php


namespace FL\Assistant\Data\Repository;


use FL\Assistant\Data\Pager;
use FL\Assistant\System\Contracts\RepositoryAbstract;

/**
 * Class TermsRepository
 * @package FL\Assistant\Data\Repository
 */
class TermsRepository extends RepositoryAbstract {

	/**
	 * @param $id
	 *
	 * @return array|\WP_Error|\WP_Term|null
	 */
	public function find( $id, callable $transform = null ) {
		$term = get_term( $id );
		if ( ! is_null( $transform ) ) {
			$term = call_user_func( $transform, $term );
		}

		return $term;
	}

	/**
	 * @param array $args
	 * @param callable|null $transform
	 *
	 * @return array
	 */
	public function find_where( array $args = [], callable $transform = null ) {
		$terms = $this->query( $args )->get_terms();
		if ( ! is_null( $transform ) ) {
			$terms = array_map( $transform, $terms );
		}
		return $terms;
	}

	/**
	 * @param array $args
	 * @param callable|null $transform
	 *
	 * @return Pager
	 */
	public function paginate( array $args = [], callable $transform = null ) {
		$query       = $this->query( $args );
		$total_terms = $this->terms_query_count( $query );

		$pager = new Pager(
			$query->get_terms(),
			$total_terms,
			$query->query_vars['number'],
			$query->query_vars['offset']
		);

		if ( ! is_null( $transform ) ) {
			$pager->apply_transform( $transform );
		}

		return $pager;
	}

	/**
	 * Returns an array of child terms for the given term.
	 * A $children array must be passed to search for children.
	 * @param $term
	 * @param $children
	 * @param callable $transformer
	 * @return array
	 */
	public function get_child_terms( $term, $children, callable $transformer = null ) {
		if ( isset( $children[ $term->term_id ] ) ) {
			$term_children = $children[ $term->term_id ];

			foreach ( $term_children as $i => $child ) {
				$term_children[ $i ]->children = $this->get_child_terms( $child, $children, $transformer );
			}

			if ( ! is_null( $transformer ) ) {
				$term_children = array_map( $transformer, $term_children );
			}

			return $term_children;
		}

		return [];
	}

	/**
	 * @param array $args
	 *
	 * @return \WP_Term_Query
	 */
	public function query( array $args = [] ) {
		return new \WP_Term_Query( $args );
	}

	/**
	 * @param \WP_Term_Query $query
	 *
	 * @return array|int|\WP_Error
	 */
	protected function terms_query_count( \WP_Term_Query $query ) {
		$taxonomy = $query->query_vars['taxonomy'];
		$args     = $query->query_vars;

		return \wp_count_terms( $taxonomy, $args );
	}

}
