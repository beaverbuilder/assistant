<?php


namespace FL\Assistant\Data\Repository;


use FL\Assistant\Data\Pager;
use FL\Assistant\System\Contracts\RepositoryAbstract;

/**
 * Class AttachmentsRepository
 * @package FL\Assistant\Data\Repository
 */
class AttachmentsRepository extends RepositoryAbstract {


	/**
	 * @param array $args
	 *
	 * @param callable|null $transform
	 *
	 * @return array
	 */
	public function find_where( array $args = [], callable $transform = null ) {
		$query = $this->query( $args );
		$attachments = $query->posts;
		if ( ! is_null( $transform ) ) {
			$attachments = array_map( $transform, $attachments );
		}
		return $attachments;
	}

	/**
	 * @param array $args
	 *
	 * @return \WP_Query
	 */
	public function query( array $args = [] ) {
		$args = array_merge(
			$args, [
				// attachments have an empty post status.
				// removing this arg will give empty results
				'post_status' => 'any',
				'perm'        => 'editable',
				'post_type'   => 'attachment',
			]
		);

		return new \WP_Query( $args );
	}

	/**
	 * @param $id
	 *
	 * @return $this
	 */
	public function delete( $id ) {
		wp_delete_attachment( $id );
		return $this;
	}


	public function restore( $id, callable $transform = null ) {
		wp_untrash_post( $id );
		if ( ! is_null( $transform ) ) {
			return $this->find( $id, $transform );
		}
		return $this->find( $id );
	}

	/**
	 * @param $id
	 *
	 * @param callable|null $transform
	 *
	 * @return array|\WP_Post|null
	 */
	public function find( $id, callable $transform = null ) {
		$attachment = get_post( $id );
		if ( ! is_null( $transform ) ) {
			$attachment = call_user_func( $transform, $attachment );
		}
		return $attachment;
	}

	/**
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

		if ( ! is_null( $transform ) ) {
			$pager->apply_transform( $transform );
		}
		return $pager;
	}
}
