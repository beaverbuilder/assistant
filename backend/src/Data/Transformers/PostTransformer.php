<?php

namespace FL\Assistant\Data\Transformers;

use FL\Assistant\Data\Repository\NotationsRepository;
use FL\Assistant\Data\Repository\TermsRepository;
use FL\Assistant\System\Integrations\BeaverBuilder;
use FL\Assistant\Helpers\PreviewHelper;

/**
 * Class PostTransformer
 *
 * Convert a WP_Post object to array suitable for REST output
 *
 * @package FL\Assistant\RestApi\Transformers
 */
class PostTransformer {

	protected $notations;
	protected $terms;
	protected $beaver_builder;

	/**
	 * PostTransformer constructor.
	 *
	 * @param NotationsRepository $notations
	 * @param BeaverBuilder $beaver_builder
	 */
	public function __construct(
		NotationsRepository $notations,
		TermsRepository $terms,
		BeaverBuilder $beaver_builder
	) {
		$this->notations = $notations;
		$this->terms = $terms;
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
		$template = get_post_meta( $post->ID, '_wp_page_template', true );

		$thumb_id = get_post_thumbnail_id( $post );
		$thumb_data = wp_prepare_attachment_for_js( $thumb_id );

		$all_users = get_users( [ 'who' => 'authors' ] );
		$users     = [];

		foreach ( $all_users as $user ) {
			$users[ $user->ID ] = $user->display_name;
		}

		if ( ! function_exists( 'wp_check_post_lock' ) ) {
			require_once ABSPATH . 'wp-admin/includes/post.php';
		}

		$response = [
			'author'           => $author,
			'post_author'      => $post->post_author,
			'commentsAllowed'  => 'open' === $post->comment_status ? true : false,
			'excerpt'          => $post->post_excerpt,
			'date'             => $date,
			'editUrl'          => get_edit_post_link( $post->ID, '' ),
			'previewUrl'       => PreviewHelper::get_post_preview_url( $post ),
			'id'               => $post->ID,
			'labels'           => [],
			'order'            => $post->menu_order,
			'parent'           => $post->post_parent,
			'password'         => $post->post_password,
			'pingbacksAllowed' => 'open' === $post->ping_status ? true : false,
			'slug'             => $post->post_name,
			'status'           => $post->post_status,
			'template'         => empty( $template ) ? 'default' : $template,
			'terms'            => [],
			'thumbnail'        => get_the_post_thumbnail_url( $post, 'thumbnail' ),
			'thumbnailData'    => $thumb_data,
			'title'            => empty( $post->post_title ) ? __( '(no title)', 'fl-assistant' ) : $post->post_title,
			'trashedStatus'    => get_post_meta( $post->ID, '_wp_trash_meta_status', true ),
			'type'             => $post->post_type,
			'url'              => get_permalink( $post ),
			'visibility'       => 'public',
			'commentsCount'    => get_comments_number( $post->ID ),
			'isSticky'         => is_sticky( $post->ID ),
			'authorList'       => $users,
			'hasLock'          => wp_check_post_lock( $post->ID ),
		];

		// Post visibility.
		if ( 'private' === $post->post_status ) {
			$response['visibility'] = 'private';
		} elseif ( ! empty( $post->post_password ) ) {
			$response['visibility'] = 'protected';
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
		$response['isFavorite'] = ! ! count( $favorites );

		// Labels
		$labels = $this->notations->get_labels( 'post', $post->ID );
		foreach ( $labels as $label ) {
			$response['labels'][] = $label['label_id'];
		}

		// Terms
		$taxonomies = get_object_taxonomies( $post->post_type, 'objects' );
		foreach ( $taxonomies as $tax_slug => $tax ) {
			if ( ! $tax->public || ! $tax->show_ui ) {
				continue;
			}
			$response['terms'][ $tax_slug ] = $this->terms->find_where(
				[
					'taxonomy'   => $tax_slug,
					'object_ids' => [ $post->ID ],
					'orderby'    => 'name',
					'order'      => 'ASC',
					'fields'     => 'ids',
				]
			);
		}

		return $response;
	}

}
