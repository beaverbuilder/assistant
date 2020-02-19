<?php


namespace FL\Assistant\Data\Repository;


use FL\Assistant\Data\Pager;
use FL\Assistant\System\Contracts\RepositoryAbstract;

/**
 * Class CommentsRepository
 * @package FL\Assistant\Data\Repository
 */
class CommentsRepository extends RepositoryAbstract {

	/**
	 * @param $id
	 * @param callable|null $transform
	 *
	 * @return array|mixed|\WP_Comment|null
	 */
	public function find( $id, callable $transform = null ) {
		$comment = get_comment( $id );
		if ( ! is_null( $transform ) ) {
			$comment = call_user_func( $transform, $comment );
		}

		return $comment;
	}

	/**
	 * @param array $args
	 * @param callable|null $transform
	 *
	 * @return array|int
	 */
	public function find_where( array $args = [], callable $transform = null ) {
		$comments = $this->query( $args )->get_comments();
		if ( ! is_null( $transform ) ) {
			$comments = array_map( $transform, $comments );
		}
		return $comments;
	}

	/**
	 * @param array $args
	 * @param callable|null $transform
	 *
	 * @return Pager
	 */
	public function paginate( array $args = [], callable $transform = null ) {
		$args['no_found_rows'] = false; // Make sure to calc the number of found rows.
		$query = $this->query( $args );

		$pager = new Pager(
			$query->get_comments(),
			$query->found_comments,
			$query->query_vars['number'],
			$query->query_vars['offset']
		);

		if ( ! is_null( $transform ) ) {
			$pager->apply_transform( $transform );
		}

		return $pager;
	}

	/**
	 * @param array $args
	 *
	 * @return \WP_Comment_Query
	 */
	public function query( array $args = [] ) {
		return new \WP_Comment_Query( $args );
	}
}
