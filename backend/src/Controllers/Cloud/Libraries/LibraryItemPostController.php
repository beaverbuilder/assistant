<?php

namespace FL\Assistant\Controllers\Cloud\Libraries;

use FL\Assistant\System\Contracts\ControllerAbstract;
use FL\Assistant\System\View;
use FL\Assistant\Data\Transformers\PostTransformer;
use FL\Assistant\Services\MediaLibraryService;
use FL\Assistant\Helpers\PostHelper;
use WP_REST_Server;

class LibraryItemPostController extends ControllerAbstract {

	public $output = [];
	public $unfilter_media = [];
	public $postmeta_images = [];
	protected $posts;
	protected $view;

	public function __construct( PostTransformer $posts, View $view ) {
		$this->posts = $posts;
		$this->view = $view;
	}

	/**
	 * Register routes.
	 */
	public function register_routes() {

		$this->route(
			'/posts/import_from_library/(?P<item_id>\d+)',
			[
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'import_from_library' ],
					'args'                => [
						'item_id' => [
							'required' => true,
							'type'     => 'number',
						],
					],
					'permission_callback' => function () {
						return current_user_can( 'edit_others_posts' );
					},
				],
			]
		);

		$this->route(
			'/posts/sync_from_library/(?P<id>\d+)/(?P<item_id>\d+)/(?P<override_type>\d+)',
			[
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'override_lib_post' ],
					'args'                => [
						'id'            => [
							'required' => true,
							'type'     => 'number',
						],
						'item_id'       => [
							'required' => true,
							'type'     => 'number',
						],
						'override_type' => [
							'required' => true,
							'type'     => 'number',
						],
					],
					'permission_callback' => function () {
						return current_user_can( 'edit_others_posts' );
					},
				],
			]
		);

		$this->route(
			'/posts/(?P<id>\d+)/library/(?P<library_id>\d+)',
			[
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'save_to_library' ],
					'args'                => [
						'id'         => [
							'required' => true,
							'type'     => 'number',
						],
						'library_id' => [
							'required' => true,
							'type'     => 'number',
						],
					],
					'permission_callback' => function () {
						return current_user_can( 'edit_others_posts' );
					},
				],
			]
		);

		$this->route(
			'/posts/preview_library_post/(?P<item_id>\d+)',
			[
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'preview_library_post' ],
					'args'                => [
						'item_id' => [
							'required' => true,
							'type'     => 'number',
						],
					],
					'permission_callback' => function () {
						return current_user_can( 'edit_others_posts' );
					},
				],
			]
		);
	}



	function sync_from_library( $request ) {

		global $wpdb;
		$post_id = $request->get_param( 'id' );
		$item_id = $request->get_param( 'item_id' );
		$override_type = $request->get_param( 'override_type' );

		$client = new \FL\Assistant\Clients\Cloud\CloudClient;
		$response = $client->libraries->get_item( $item_id );

		$post_data = $response->data->post;
		$post_meta = $response->data->meta;
		$post_terms  = $response->data->terms;

		$override_post = [];
		$override_post['ID'] = $post_id;

		if ( $post_meta && count( $post_meta ) !== 0 ) {

			foreach ( $post_meta as $key => $meta_value ) {

				$meta_key = $key ? $key : '';

				if ( '' !== $meta_key ) {
					if ( metadata_exists( 'post', $post_id, '_' . $meta_key ) ) {

						update_metadata( 'post', $post_id, $meta_key, $meta_value );

					} else {
						if ( count( $meta_value ) >= 1 ) {
							foreach ( $meta_value as $value ) {
								$value = $value ? addslashes( $value ) : '';
								$wpdb->query( "INSERT INTO {$wpdb->postmeta} (post_id, meta_key, meta_value) values ({$post_id}, '{$meta_key}', '{$value}')" ); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared

							}
						}
					}
				}
			}
		}

		if ( '2' === $override_type ) {

			$override_post['post_content'] = $post_data->post_content;
		} elseif ( '3' === $override_type ) {

			if ( is_array( $post_terms ) && count( $post_terms ) !== 0 ) {

				foreach ( $post_terms as $category ) {
					if ( taxonomy_exists( $category->taxonomy ) ) {
						$term = term_exists( $category->slug, $category->taxonomy );
						if ( 0 !== $term && null !== $term ) {
							wp_set_post_terms( $new_post_id, [ $term['term_taxonomy_id'] ], $category->taxonomy, true );
						} else {
							wp_insert_term(
								$category->name,   // the term
								$category->taxonomy, // the taxonomy
								[
									'description' => $category->description,
									'slug'        => $category->slug,
									'parent'      => $category->parent,
								]
							);

							wp_set_post_terms( $new_post_id, [ $term['term_taxonomy_id'] ], $category->taxonomy, true );
						}
					}
				}
			}
		} else {

			$override_post['post_content'] = $post_data->post_content;
			if ( is_array( $post_terms ) && count( $post_terms ) !== 0 ) {

				foreach ( $post_terms as $category ) {
					if ( taxonomy_exists( $category->taxonomy ) ) {
						$term = term_exists( $category->slug, $category->taxonomy );
						if ( 0 !== $term && null !== $term ) {
							wp_set_post_terms( $new_post_id, [ $term['term_taxonomy_id'] ], $category->taxonomy, true );
						} else {
							wp_insert_term(
								$category->name,   // the term
								$category->taxonomy, // the taxonomy
								[
									'description' => $category->description,
									'slug'        => $category->slug,
									'parent'      => $category->parent,
								]
							);

							wp_set_post_terms( $new_post_id, [ $term['term_taxonomy_id'] ], $category->taxonomy, true );
						}
					}
				}
			}
		}

		if ( is_wp_error( wp_update_post( $override_post ) ) ) {
			return rest_ensure_response(
				[
					'error' => true,
				]
			);
		} else {
			return rest_ensure_response(
				$this->posts->transform(
					get_post( $post_id )
				)
			);
		}

	}



	function get_screenshot( $request, $post ) {
		$screenshot = $request->get_param( 'screenshot' );

		if ( $screenshot ) {
			return [
				'type' => 'base64',
				'data' => $screenshot,
			];
		}

		$url = PostHelper::get_preview_url( $post );
		$response = wp_remote_get(
			$url, [
				'cookies' => $_COOKIE,
			]
		);

		return [
			'type' => 'html',
			'html' => wp_remote_retrieve_body( $response ),
		];
	}



	function save_to_library( $request ) {

		$id = $request->get_param( 'id' );
		$library_id = $request->get_param( 'library_id' );

		$post = get_post( $id );

		$post_content_images = $this->get_all_images( $post->post_content );

		$post_meta = get_post_meta( $id );
		$post_meta_images = [];

		if ( $post_meta && count( $post_meta ) !== 0 ) {

			foreach ( $post_meta as $key => $meta_value ) {

				$meta_key = $key ? $key : '';

				if ( '' !== $meta_key ) {
					if ( count( $meta_value ) >= 1 ) {
						foreach ( $meta_value as $value ) {
							$post_meta_images = $this->preg_grep_recursive( maybe_unserialize( $value ) );

						}
					}
				}
			}
		}

		$client = new \FL\Assistant\Clients\Cloud\CloudClient;

		$thumb_path = get_attached_file( get_post_thumbnail_id( $post ) );

		$media_merge = array_merge( $post_content_images, $post_meta_images );
		$media_array = array_values( array_unique( $media_merge ) );

		$taxonomies = get_taxonomies( '', 'names' );
		$post_taxonomies = wp_get_object_terms( $id, $taxonomies );

		$comments = get_comments( [ 'post_id' => $id ] );

		return $client->libraries->create_item(
			$library_id,
			[
				'name'       => $post->post_title,
				'type'       => 'post',
				'data'       => [
					'post'      => $post,
					'meta'      => get_post_meta( $id ),
					'terms'     => $post_taxonomies,
					'comments'  => $comments,
					//'html'       => $this->get_screenshot_html( $post ),
					'raw_media' => $this->unfilter_media,

				],
				'media'      => [
					'thumb'       => $thumb_path,
					'attachments' => $media_array,
				],
				'screenshot' => $this->get_screenshot( $request, $post ),
			],
		);

	}


	function import_from_library( $request ) {

		global $wpdb;

		$item_id = $request->get_param( 'item_id' );
		$client = new \FL\Assistant\Clients\Cloud\CloudClient;
		$response = $client->libraries->get_item( $item_id );

		$post_data = $response->data->post;
		$post_meta = $response->data->meta;
		$post_terms  = $response->data->terms;
		$current_user = wp_get_current_user();

		$newpost_data = [
			'post_author'    => $current_user->ID,
			'post_content'   => $post_data->post_content ? $post_data->post_content : '',
			'post_excerpt'   => $post_data->post_excerpt ? $post_data->post_excerpt : '',
			'post_name'      => $post_data->post_name ? $post_data->post_name : '',
			'post_status'    => 'draft',
			'post_title'     => $post_data->post_title,
			'post_type'      => $post_data->post_type,
			'menu_order'     => $post_data->menu_order,
			'post_mime_type' => $post_data->post_mime_type,
		];

		$new_post_id = wp_insert_post( $newpost_data );

		if ( is_wp_error( $new_post_id ) ) {

			return rest_ensure_response(
				[
					'error' => true,
				]
			);

		} else {

			/*Import media */

			$media = $response->media;
			if ( $post_meta && count( $post_meta ) !== 0 ) {

				foreach ( $post_meta as $key => $meta_value ) {

					$meta_key = $key ? $key : '';

					if ( '' !== $meta_key ) {
						if ( count( $meta_value ) >= 1 ) {
							foreach ( $meta_value as $value ) {
								$value = $value ? addslashes( $value ) : '';
								$wpdb->query( "INSERT INTO {$wpdb->postmeta} (post_id, meta_key, meta_value) values ({$new_post_id}, '{$meta_key}', '{$value}')" ); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
							}
						}
					}
				}
			}

			foreach ( $media->attachments as $key => $item ) {

				// Check if already imported using $item->uuid
				$row = $wpdb->get_row( "SELECT * FROM $wpdb->postmeta WHERE meta_value = '$item->uuid'" );

				if ( $row ) {

					// Already imported. Save the existing attachment ID.
					$attachment_id = $row->post_id;
					$attachment_url = wp_get_attachment_url( $attachment_id );

					/*Get all media url from post content */

					$replaced_post_content = get_post_field( 'post_content', $new_post_id );
					$content_images = $this->get_all_images( $replaced_post_content );
					$content_images = $this->unfilter_media;

					$update_post = [];
					$update_post['ID'] = $new_post_id;

					/*Loop all post content medias and replace it with new cloud imported URLS */
					foreach ( $content_images[0] as $content_image ) {

						if ( strpos( $content_image, $item->file_name ) ) {

							$replaced_post_content = get_post_field( 'post_content', $new_post_id );
							$update_post['post_content'] = str_replace( $content_image, $attachment_url, $replaced_post_content );
							wp_update_post( $update_post );
						}
					}

					/*Get all media url from post meta */
					$post_meta_images = [];
					if ( $post_meta && count( $post_meta ) !== 0 ) {

						foreach ( $post_meta as $key => $meta_value ) {

							$meta_key = $key ? $key : '';

							if ( '' !== $meta_key ) {
								if ( count( $meta_value ) >= 1 ) {
									foreach ( $meta_value as $value ) {

										$post_meta_images[] = $this->preg_grep_recursive( maybe_unserialize( $value ), true );

									}
								}
							}
						}
					}

					$post_meta_images = array_values( array_unique( $post_meta_images[0] ) );

					$post_meta = get_post_meta( $new_post_id );
					$item_file_name = $item->file_name;

					/*Loop all post meta medias and replace it with new cloud imported URLS */
					if ( ! empty( $post_meta_images ) ) {

						foreach ( $post_meta_images as $postmeta_image ) {
							$postmeta_image_url = $postmeta_image;

							foreach ( $post_meta as $key => $meta_value ) {

								$meta_key = $key ? $key : '';

								if ( '' !== $meta_key ) {
									if ( count( $meta_value ) >= 1 ) {
										foreach ( $meta_value as $value ) {

											if ( strpos( $postmeta_image_url, $item_file_name ) ) {

												$get_value = $wpdb->get_results( "SELECT meta_value,meta_key from {$wpdb->postmeta} where post_id = '{$new_post_id}' AND meta_key = '{$meta_key}' AND meta_value LIKE '%{$postmeta_image}%'" ); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
												if ( ! empty( $get_value ) ) {

													$replaced_arr = $this->search_replace_array( maybe_unserialize( $get_value[0]->meta_value ), $postmeta_image, $attachment_url, $item->file_name );

													update_post_meta( $new_post_id, $get_value[0]->meta_key, $replaced_arr );
												}
											}
										}
									}
								}
							}
						}
					}
				} else {

					// Not imported. Upload and save the new attachment ID.
					$service = new MediaLibraryService();
					$import_image_response = $service->import_image( $item->url, $item->file_name, $new_post_id );
					$attachment_url = $import_image_response['url'];
					update_post_meta( $import_image_response['id'], 'fl-asst-media-uuid', $item->uuid );
					$item_file_name = $item->file_name;
					$update_post = [];
					$update_post['ID'] = $new_post_id;
					$replaced_post_content = get_post_field( 'post_content', $new_post_id );
					$content_images = $this->get_all_images( $replaced_post_content );
					$content_images = $this->unfilter_media;

					foreach ( $content_images[0] as $content_image ) {
						if ( strpos( $content_image, $item->file_name ) ) {

							   $replaced_post_content = get_post_field( 'post_content', $new_post_id );
							   $update_post['post_content'] = str_replace( $content_image, $attachment_url, $replaced_post_content ) . '<br><br>';
							   wp_update_post( $update_post );

						}
					}

					/*Get all media url from post meta */

					if ( $post_meta && count( $post_meta ) !== 0 ) {

						foreach ( $post_meta as $key => $meta_value ) {

							$meta_key = $key ? $key : '';

							if ( '' !== $meta_key ) {
								if ( count( $meta_value ) >= 1 ) {
									foreach ( $meta_value as $value ) {

										   $post_meta_images[] = $this->preg_grep_recursive( maybe_unserialize( $value ), true );

									}
								}
							}
						}
					}

					$post_meta_images = array_values( array_unique( $post_meta_images[0] ) );
					$post_meta = get_post_meta( $new_post_id );
					/*Loop all post meta medias and replace it with new cloud imported URLS */
					if ( ! empty( $post_meta_images ) ) {
						foreach ( $post_meta_images as $postmeta_image ) {

							if ( strpos( $postmeta_image, $item->file_name ) ) {
								foreach ( $post_meta as $key => $meta_value ) {

									$meta_key = $key ? $key : '';

									if ( '' !== $meta_key ) {
										if ( count( $meta_value ) >= 1 ) {
											foreach ( $meta_value as $value ) {

												if ( strpos( $postmeta_image_url, $item_file_name ) ) {

													$get_value = $wpdb->get_results( "SELECT meta_value,meta_key from {$wpdb->postmeta} where post_id = '{$new_post_id}' AND meta_key = '{$meta_key}' AND meta_value LIKE '%{$postmeta_image}%'" ); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
													if ( ! empty( $get_value ) ) {

														$replaced_arr = $this->search_replace_array( maybe_unserialize( $get_value[0]->meta_value ), $postmeta_image, $attachment_url, $item->file_name );

														update_post_meta( $new_post_id, $get_value[0]->meta_key, $replaced_arr );
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}

			/*Importing feature image */
			$thumbnail_data = $media->thumb;

			// Check if already imported using $item->uuid
			$row = $wpdb->get_row( "SELECT * FROM $wpdb->postmeta WHERE meta_value = '$thumbnail_data->uuid'" );

			if ( $row ) {

				// Already imported. Save the existing attachment ID.
				$attachment_id = $row->post_id;
				$attachment_url = wp_get_attachment_url( $attachment_id );
				$success = set_post_thumbnail( $new_post_id, $attachment_id );

			} else {

				$service = new MediaLibraryService();
				$import_image_response = $service->import_image( $thumbnail_data->url, $thumbnail_data->file_name, $new_post_id );
				$attachment_url = $import_image_response['url'];
				$attachment_id = $import_image_response['id'];
				update_post_meta( $import_image_response['id'], 'fl-asst-media-uuid', $thumbnail_data->uuid );
				$success = set_post_thumbnail( $new_post_id, $attachment_id );

			}

			/*Import post terms */

			if ( is_array( $post_terms ) && count( $post_terms ) !== 0 ) {

				foreach ( $post_terms as $category ) {
					if ( taxonomy_exists( $category->taxonomy ) ) {
						$term = term_exists( $category->slug, $category->taxonomy );
						if ( 0 !== $term && null !== $term ) {
							wp_set_post_terms( $new_post_id, [ $term['term_taxonomy_id'] ], $category->taxonomy, true );
						} else {
							wp_insert_term(
								$category->name,   // the term
								$category->taxonomy, // the taxonomy
								[
									'description' => $category->description,
									'slug'        => $category->slug,
									'parent'      => $category->parent,
								]
							);

							wp_set_post_terms( $new_post_id, [ $term['term_taxonomy_id'] ], $category->taxonomy, true );
						}
					}
				}
			}

			return rest_ensure_response(
				$this->posts->transform(
					get_post( $new_post_id )
				)
			);
		}

	}



	function get_all_images( $post_content = '' ) {

		ob_start();
		ob_end_clean();
		//preg_match_all( '/<img.+src=[\'"]([^\'"]+)[\'"].*>/i', $post_content, $matches );
		preg_match_all( '@src="([^"]+)"@', $post_content, $match );
		$src = array_pop( $match );
		array_push( $this->unfilter_media, $src );
		$upload_media_path = $this->filter_uploads_path( $src );
		return $upload_media_path;
	}



	public function preg_grep_recursive( $input = [], $keys = false ) {

		if ( is_object( $input ) || is_array( $input ) ) {

			foreach ( $input as $key => $val ) {

				if ( is_object( $val ) || is_array( $val ) ) {

					$this->preg_grep_recursive( $val, $keys );
				} else {

					if ( preg_match_all( '#http?://[^,\s()<>]+(?:\([\w\d]+\)|([^,[:punct:]\s]|/)\.(jpg|jpeg|png))#', $val, $matches ) ) {

						if ( isset( $matches[0][0] ) && '' !== $matches[0][0] ) {

								  $this->$postmeta_images[] = $matches[0][0];

						}

						if ( isset( $matches[0][0] ) && '' !== $matches[0][0] && ! in_array( $matches[0][0], $this->output, true ) ) {

							if ( $matches[0][0] ) {

								array_push( $this->unfilter_media, $matches[0][0] );

								array_push( $this->output, $upload_media_path );

								$upload_media_path = $this->filter_uploads_path( $matches[0][0] );

								if ( $upload_media_path ) {
									array_push( $this->output, $upload_media_path );
								}
							}
						}
					}
				}
			}
		}

		if ( true === $keys ) {
			return $this->$postmeta_images;
		}
		return $this->output;

	}



	function preview_library_post( $request ) {
		global $wpdb;

		$item_id = $request->get_param( 'item_id' );

		$meta = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM $wpdb->postmeta
			 WHERE meta_key = '_fl_asst_preview_library_item_id'
			 AND meta_value = %s",
				$item_id
			)
		);

		if ( $meta ) {
			$request->set_param( 'id', $meta->post_id );
			$response = $this->sync_from_library( $request );
		} else {
			$response = $this->import_from_library( $request );
		}

		if ( isset( $response->data['error'] ) ) {
			return $response;
		}

		$post_id = $response->data['id'];

		wp_update_post(
			[
				'ID'          => $post_id,
				'post_status' => 'auto-draft',
			]
		);

		update_post_meta( $post_id, '_fl_asst_preview_library_item_id', $item_id );

		return rest_ensure_response(
			[
				'url' => PostHelper::get_preview_url( $post_id ),
			]
		);
	}



	function filter_uploads_path( $image_path ) {

		$upload_dir_path = wp_get_upload_dir();

		if ( is_array( $image_path ) ) {
			$media_urls = [];
			foreach ( $image_path as $path ) {
				$parts = explode( '/uploads/', $path );
				if ( $parts[1] && $path ) {
					$media_urls[] = $upload_dir_path['basedir'] . '/' . $parts[1];
				}
			}
		} else {
			$parts = explode( '/uploads/', $image_path );
			if ( $parts[1] && $image_path ) {
				$media_urls = $upload_dir_path['basedir'] . '/' . $parts[1];
			} else {
				$media_urls = '';
			}
		}

		return $media_urls;

	}



	function search_replace_array( $input = [], $search = '', $replace = '', $pos_needle = '' ) {

		if ( is_object( $input ) || is_array( $input ) ) {

			foreach ( $input as $key => $val ) {

				if ( is_object( $val ) || is_array( $val ) ) {

					$this->search_replace_array( $val, $search, $replace );

				} else {

						$value = str_replace( $search, $replace, $val );

					if ( is_object( $input ) ) {
						$input->$key = $value;
					} else {
						$input[ $key ] = $value;
					}
				}
			}
		}

		return $input;

	}
}
