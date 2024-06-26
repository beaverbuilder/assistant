<?php


namespace FL\Assistant\Data\Repository;


/**
 * Class CodeRepository
 * @package FL\Assistant\Data\Repository
 */
class CodeRepository {

	/**
	 * @param array $args
	 *
	 * @return \WP_Query
	 */
	public function query( array $args = [] ) {
		$args = array_merge(
			$args, [
				'post_status' => 'published',
				'perm'        => 'editable',
				'post_type'   => 'fl_code',
			]
		);

		return new \WP_Query( $args );
	}

	/**
	 * Get array of code with the corresponding meta values.
	 * @return array
	 */
	public function get_by_meta( $meta ) {

		$meta_query = [];
		foreach ( $meta as $key => $value ) {
			$meta_query[] = [
				'key'     => $key,
				'value'   => $value,
				'compare' => '=',
			];
		}

		$query = $this->query(
			[
				'meta_query' => $meta_query,
			]
		);

		return $query->posts;
	}

	/**
	 * Get an array of code for the given object.
	 * @return array
	 */
	public function get_active_code() {
		return $this->get_by_meta(
			[
				'_fl_asst_enable' => '1',
			]
		);
	}

	public function evalute_code_rules( $view ) {

 		$code_data = $this->get_active_code();

 		$results = [];
		if( ! empty( $code_data ) ) {
			foreach( $code_data as $post ) {
				$id = $post->ID;
				$code = get_post_meta( $id, '_fl_asst_code', true );
				$code_type = get_post_meta( $id, '_fl_asst_code_type', true );
				$locations = get_post_meta( $id, '_fl_asst_code_locations', true );
				$locations = maybe_unserialize( $locations );

				if( ! empty( $locations ) ) {

					foreach( $locations as $rule ) {

						extract( $rule );

						switch ( $type ) {

							case 'post_type':

								$result = false;
								if( 'equals' === $operator ) {
									$result = $value === $view['type_name'];
								}
								if( 'does_not_equal' === $operator ) {
									$result = $value !== $view['type_name'];
								}
								break;

							case 'entire_site':

								$result = true;
								break;

							case 'all_singular':

								$result = true === $view['isSingular'];
								break;

							case 'all_archives':

								$result = true === ( true === $view['isPostTypeArchive'] || true === $view['isAuthor'] || true === $view['isDate'] || true === $view['isSearch'] );
								break;

							case 'author_archives':

								$result = true === $view['isAuthor'];
								break;

							case 'date_archives':

								$result = true === $view['isDate'];
								break;

							case 'search_results':

								$result = true === $view['isSearch'];
								break;

							case '404_page':

								$result = true === $view['is404'];
								break;

							case 'default':
								$result = false;
								break;
						}

						if( $result ) {
							break;
						}
					}

					if( $result ) {

						if( 'CSS' === $code_type ) {
							$results[ $code_type ] = isset( $results[ $code_type ] ) ? $results[ $code_type ] . $code : $code;
						} else {
							$results[ $code_type ][] = $code;
						}
					}
				}
			}
		}
		return $results;
	}

}
