<?php

namespace FL\Assistant\Controllers;

use FL\Assistant\System\Contracts\ControllerAbstract;
use FL\Assistant\System\View;
use WP_REST_Server;

/**
 * REST API logic for exporting posts.
 */
class PostsExportController extends ControllerAbstract {

	protected $view;

	public function __construct( View $view ) {
		$this->view = $view;
	}

	/**
	 * Register routes.
	 */
	public function register_routes() {
		$this->route(
			'/posts/(?P<id>\d+)/export',
			[
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'export_post' ],
					'permission_callback' => function () {
						return current_user_can( 'export' );
					},
				],
			]
		);
	}

	/**
	 * Export a single post.
	 */
	public function export_post( $request ) {

		/* Get requested post data */
		$post_id = absint( $request->get_param( 'id' ) );
		$post = get_post( $post_id );

		/* Create temporary file */
		$upload_dir = wp_upload_dir( null, false );
		$file_url = $upload_dir['baseurl'] . '/assistant_export_' . $post->ID . '.xml';
		$file = $upload_dir['basedir'] . '/assistant_export_' . $post->ID . '.xml';

		/* Creates taxonomies string for xml export */
		$taxonomies = get_taxonomies( '', 'names' );
		$terms = wp_get_object_terms( $post->ID, $taxonomies );

		$taxonomies_str = '';
		foreach ( $terms as $term ) {
			$taxonomies_str .= '<category domain="' . $term->taxonomy . '" nicename="' . $term->slug . '">' . $this->wxr_cdata( $term->name ) . '</category>';
		}

		/* Creates comments string  */
		$comments = get_comments( [ 'post_id' => $post->ID ] );

		$comment_str = '';

		foreach ( $comments as $comment ) {

			$comment_str .= '<wp:comment>
			<wp:comment_id>' . $comment->comment_ID . '</wp:comment_id>
			<wp:comment_author>' . $this->wxr_cdata( $comment->comment_author ) . '</wp:comment_author>
			<wp:comment_author_email>' . $this->wxr_cdata( $comment->comment_author_email ) . '</wp:comment_author_email>
			<wp:comment_author_url></wp:comment_author_url>
			<wp:comment_author_IP>' . $this->wxr_cdata( $comment->comment_author_ip ) . '</wp:comment_author_IP>
			<wp:comment_date>' . $this->wxr_cdata( $comment->comment_date ) . '</wp:comment_date>
			<wp:comment_date_gmt>' . $this->wxr_cdata( $comment->comment_date_gmt ) . '</wp:comment_date_gmt>
			<wp:comment_content>' . $this->wxr_cdata( $comment->comment_content ) . '</wp:comment_content>
			<wp:comment_approved>' . $this->wxr_cdata( $comment->comment_approved ) . '</wp:comment_approved>
			<wp:comment_type><![CDATA[]]></wp:comment_type>
			<wp:comment_parent>' . $comment->comment_parent . '</wp:comment_parent>
			<wp:comment_user_id>' . $comment->user_id . '</wp:comment_user_id>
			</wp:comment>
			';
		}

		/* Creates post meta string */
		$meta_str = '';
		$meta_values = get_post_meta( $post->ID );
		foreach ( $meta_values as $key => $values ) {
			foreach ( $values as $value ) {
				/* Ignore BB history meta */
				if ( false !== strpos( $key, '_fl_builder_history' ) ) {
					continue;
				}
				$meta_str .= '<wp:postmeta>
				<wp:meta_key>' . $this->wxr_cdata( $key ) . '</wp:meta_key>
				<wp:meta_value>' . $this->wxr_cdata( $value ) . '</wp:meta_value>
				</wp:postmeta>
				';
			}
		}

		/* Author data */

		$author_display_name = $this->wxr_cdata( get_the_author_meta( 'display_name', $post->post_author ) );

		/* Post content */

		$post_content   = $this->wxr_cdata( $post->post_author );
		$post_excerpt   = $this->wxr_cdata( $post->post_excerpt );
		$post_date      = $this->wxr_cdata( $post->post_date );
		$post_date_gmt  = $this->wxr_cdata( $post->post_date_gmt );
		$comment_status = $this->wxr_cdata( $post->comment_status );
		$ping_status    = $this->wxr_cdata( $post->ping_status );
		$post_title     = $this->wxr_cdata( $post->post_title );
		$post_status    = $this->wxr_cdata( $post->post_status );
		$post_type      = $this->wxr_cdata( $post->post_type );

		$export_data = $this->view->render_to_string(
			'post-export',
			[
				'post'           => $post,
				'taxonomy_data'  => $taxonomies_str,
				'comment_data'   => $comment_str,
				'meta_data'      => $meta_str,
				'author_name'    => $author_display_name,
				'post_content'   => $post_content,
				'post_excerpt'   => $post_excerpt,
				'post_date'      => $post_date,
				'post_date_gmt'  => $post_date_gmt,
				'comment_status' => $comment_status,
				'ping_status'    => $ping_status,
				'post_title'     => $post_title,
				'post_status'    => $post_status,
				'post_type'      => $post_type,
			]
		);

		file_put_contents( $file, $export_data );
		update_option( 'fl_assistant_export_file', true );
		return $file_url;
	}

	function wxr_cdata( $str ) {
		if ( ! seems_utf8( $str ) ) {
			$str = utf8_encode( $str );
		}
		$str = '<![CDATA[' . str_replace( ']]>', ']]]]><![CDATA[>', $str ) . ']]>';

		return $str;
	}
}
