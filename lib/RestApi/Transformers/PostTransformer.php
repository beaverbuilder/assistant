<?php


namespace FL\Assistant\RestApi\Transformers;

use FL\Assistant\Data\Notations;
use FL\Assistant\Data\Posts;
use FL\Assistant\Support\Integrations\BeaverBuilder;


/**
 * Class PostTransformer
 *
 * Convert a WP_Post object to array suitable for REST output
 *
 * @package FL\Assistant\RestApi\Transformers
 */
class PostTransformer {


	protected $posts;
	protected $notations;
	protected $beaver_builder;

	/**
	 * PostTransformer constructor.
	 *
	 * @param Posts $posts
	 * @param Notations $notations
	 * @param BeaverBuilder $beaver_builder
	 */
	public function __construct(Posts $posts, Notations $notations, BeaverBuilder $beaver_builder) {
		$this->posts = $posts;
		$this->notations = $notations;
		$this->beaver_builder = $beaver_builder;
	}

	/**
	 * Allow this class to be used as a callback for pagination
	 * @param \WP_Post $post
	 *
	 * @return array
	 */
	public function __invoke( \WP_Post $post ) {
		return $this->transform( $post );
	}

	/**
	 * @param \WP_Post $post
	 *
	 * @return array
	 */
	public function transform( \WP_Post $post ) {

		$author   = get_the_author_meta( 'display_name', $post->post_author );
		$date     = get_the_date( '', $post );
		$response = [
			'author'          => $author,
			'commentsAllowed' => 'open' === $post->comment_status ? true : false,
			'content'         => $post->post_content,
			'excerpt'         => $post->post_excerpt,
			'date'            => $date,
			'editUrl'         => get_edit_post_link( $post->ID, '' ),
			'id'              => $post->ID,
			'meta'            => $author . ' - ' . $date,
			'parent'          => $post->post_parent,
			'slug'            => $post->post_name,
			'status'          => $post->post_status,
			'thumbnail'       => get_the_post_thumbnail_url( $post, 'thumbnail' ),
			'title'           => empty( $post->post_title ) ? __( '(no title)', 'fl-assistant' ) : $post->post_title,
			'trashedStatus'	  => get_post_meta( $post->ID, '_wp_trash_meta_status', true ),
			'type'            => $post->post_type,
			'url'             => get_permalink( $post ),
			'visibility'      => __( 'Public', 'fl-assistant' ),
		];

		// Post visibility.
		if ( 'private' === $post->post_status ) {
			$response['visibility'] = __( 'Private', 'fl-assistant' );
		} elseif ( ! empty( $post->post_password ) ) {
			$response['visibility'] = __( 'Password Protected', 'fl-assistant' );
		}

		// Beaver Builder data.
		if ( $this->beaver_builder->is_installed() ) {

			$response['bbCanEdit']   = $this->beaver_builder->can_edit_post( $post->ID );
			$response['bbIsEnabled'] = \FLBuilderModel::is_builder_enabled( $post->ID );
			$response['bbBranding']  = \FLBuilderModel::get_branding();
			$response['bbEditUrl']   = \FLBuilderModel::get_edit_url( $post->ID );
		}

		// Favorites
		$favorites = $this->notations->get_favorites( 'post', $post->ID, get_current_user_id() );
		$response['isFavorite'] = !! count( $favorites );

		return $response;
	}

}
