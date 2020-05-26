<?php

namespace FL\Assistant\Controllers;

use FL\Assistant\System\Contracts\ControllerAbstract;
use FL\Assistant\System\View;
use WP_REST_Server;

/**
 * REST API logic for importing posts.
 */
class PostsImportController extends ControllerAbstract {

	protected $view;

	public function __construct( View $view ) {
		$this->view = $view;
	}

	/**
	 * Register routes.
	 */
	public function register_routes() {
		$this->route(
			'/posts/import',
			[
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'import_posts' ],
					'permission_callback' => function () {
						return current_user_can( 'edit_published_posts' );
					},
				],
			]
		);
	}

	/*Import posts */

	public function import_posts( $request ) {
		$file = $request->get_file_params();

		global $wpdb;

		//$uri = get_template_directory_uri().'/xmlupload/';
		$uri         = wp_upload_dir();
		$target_dir  = $uri;
		$target_file = $target_dir['path'] . basename( $file['file']['name'] );
		$filename    = basename( $file['file']['name'] );
		$filetypenew = wp_check_filetype( $filename );
		$upload_ok    = 1;
		$file_type    = pathinfo( $target_file, PATHINFO_EXTENSION );
		//$FileType = pathinfo($filetype,PATHINFO_EXTENSION);

		// Check file size

		// Allow certain file formats
		if ( $file_type != 'xml' ) {

			return rest_ensure_response(
				[
					'error'   => true,
					'message' => 'Sorry, only XML files are allowed.',
				]
			);
			$upload_ok = 0;
		} else {
			if ( $file['file']['size'] > 2000000 ) {

				return rest_ensure_response(
					[
						'error'   => true,
						'message' => 'Sorry, your file is too large.',
					]
				);
				$upload_ok = 0;
			}
		}
		// Check if $uploadOk is set to 0 by an error
		if ( $upload_ok == 0 ) {

			return rest_ensure_response(
				[
					'error'   => true,
					'message' => 'Sorry, your file was not uploaded.',
				]
			);
		} else {
			if ( move_uploaded_file( $file['file']['tmp_name'], $target_file ) ) {
				// echo "<br/><br/>The file " . basename($file["file"]["name"]) . " has been uploaded successfully!!.";
				$xml = simplexml_load_file( $target_file );

				$counter          = 0;
				$status           = '';
				$state            = '';
				$suburb           = '';
				$additional_array = '';

				$xml_data = $this->XMLtoArray( file_get_contents( $target_file ) );

				$post_arr = [];
				if ( $this->isAssoc( $xml_data['RSS']['CHANNEL']['ITEM'] ) ) {
					$post_arr[] = $xml_data['RSS']['CHANNEL']['ITEM'];
				} else {
					$post_arr = $xml_data['RSS']['CHANNEL']['ITEM'];
				}

				$sucess_imp_count = 0;
				$fail_imp_count = 0;

				foreach ( $post_arr as $property ) {

					$current_user = wp_get_current_user();
					$post_data    = [
						'comment_status' => $property['WP:COMMENT_STATUS'],
						'ping_status'    => $property['WP:PING_STATUS'],
						'post_author'    => $current_user->ID,
						'post_content'   => $property['DESCRIPTION'] ? $property['DESCRIPTION'] : '',
						'post_excerpt'   => $property['EXCERPT:ENCODED'] ? $property['EXCERPT:ENCODED'] : '',
						'post_name'      => $property['WP:POST_NAME'],
						'post_status'    => $property['WP:STATUS'],
						/* translators: %s: post/page title */
						'post_title'     => $property['TITLE'],
						'post_type'      => $property['WP:POST_TYPE'],
						'to_ping'        => $property['WP:PING_STATUS'],
						'menu_order'     => $property['WP:MENU_ORDER'],
					];

					if ( ! function_exists( 'post_exists' ) ) {
						require_once ABSPATH . 'wp-admin/includes/post.php';
					}
					if ( 0 === post_exists( $property['TITLE'], '', '', $property['WP:POST_TYPE'] ) ) {

						/* Import Attachments */

						if ( $property['WP:POST_TYPE'] == 'attachment' ) {

							$file = $property['WP:ATTACHMENT_URL'];
							$filename = basename( $file );
							$read_file = file_get_contents( $file );

							if ( $read_file ) {

								$upload_file = wp_upload_bits( $filename, null, $read_file );

								if ( ! $upload_file['error'] ) {

									$wp_filetype = wp_check_filetype( $filename, null );
									$post_data['post_mime_type'] = $wp_filetype['type'];
									$attachment_id = wp_insert_attachment( $post_data, $upload_file['file'] );
									if ( ! is_wp_error( $attachment_id ) ) {
										require_once( ABSPATH . 'wp-admin' . '/includes/image.php' );
										$attachment_data = wp_generate_attachment_metadata( $attachment_id, $upload_file['file'] );
										wp_update_attachment_metadata( $attachment_id, $attachment_data );
									}

									$sucess_imp_count++;

								} else {
									$fail_imp_count++;
									return rest_ensure_response(
										[
											'error'   => true,
											'message' => 'Unable to upload attachment!',
										]
									);
								}
							} else {
								$fail_imp_count++;
								return rest_ensure_response(
									[
										'error'   => true,
										'message' => 'Unable to upload attachment!',
									]
								);
							}
						} else {
							$new_post_id = wp_insert_post( $post_data );
							wp_set_post_terms( $new_post_id, null, 'category' );
							$post_meta = $property['WP:POSTMETA'];
							$post_cat  = $property['CATEGORY'];

							if ( count( $post_meta ) !== 0 ) {
								foreach ( $post_meta as $meta_info ) {

									$meta_key   = $meta_info['WP:META_KEY'];
									$meta_value = addslashes( $meta_info['WP:META_VALUE'] );
									$wpdb->query( "INSERT INTO {$wpdb->postmeta} (post_id, meta_key, meta_value) values ({$new_post_id}, '{$meta_key}', '{$meta_value}')" ); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared

								}
							}

							if ( count( $post_cat ) !== 0 ) {

								foreach ( $post_cat as $category ) {

									   $term = term_exists( $category['content'], $category['DOMAIN'] );

									   wp_set_post_terms( $new_post_id, [ $term['term_taxonomy_id'] ], $category['DOMAIN'], true );

								}
							}

							$sucess_imp_count++;
						}
					} else {
						$fail_imp_count++;

					}
				}

				$post_fail_msg = 'Post Imported Failed!';

				if ( $sucess_imp_count > 1 ) {
					$post_success_msg = $sucess_imp_count . ' ' . ucfirst( $property['WP:POST_TYPE'] ) . 's Imported Successfully!';
				} elseif ( $sucess_imp_count === 1 ) {
					$post_success_msg = ucfirst( $property['WP:POST_TYPE'] ) . ' Imported Successfully!';
				} else {
					$post_success_msg = '';
				}

				if ( $fail_imp_count > 1 ) {
					$post_fail_msg = $fail_imp_count . ' ' . ucfirst( $property[' WP:POST_TYPE '] ) . 's Already exist or unable to Import!';
				} elseif ( $fail_imp_count === 1 ) {
					$post_fail_msg = ucfirst( $property['WP:POST_TYPE'] ) . ' Already exist or unable to Import!';
				} else {
					$post_fail_msg = '';
				}

				return rest_ensure_response(
					[
						'success' => true,
						'message' => $post_success_msg . ' ' . $post_fail_msg,
					]
				);

			} else {

				return rest_ensure_response(
					[
						'error'   => true,
						'message' => 'Sorry, there was an error uploading your file.',
					]
				);
			}
		}
	}

	public function XMLtoArray( $xml ) {
		$xml_parser = xml_parser_create();
		xml_parse_into_struct( $xml_parser, $xml, $vals );
		xml_parser_free( $xml_parser );
		// wyznaczamy tablice z powtarzajacymi sie tagami na tym samym poziomie
		$_tmp = '';
		foreach ( $vals as $xml_elem ) {
			$x_tag   = $xml_elem['tag'];
			$x_level = $xml_elem['level'];
			$x_type  = $xml_elem['type'];
			if ( $x_level !== 1 && $x_type === 'close' ) {
				if ( isset( $multi_key[ $x_tag ][ $x_level ] ) ) {
					$multi_key[ $x_tag ][ $x_level ] = 1;
				} else {
					$multi_key[ $x_tag ][ $x_level ] = 0;
				}
			}
			if ( $x_level !== 1 && $x_type === 'complete' ) {
				if ( $_tmp == $x_tag ) {
					$multi_key[ $x_tag ][ $x_level ] = 1;
				}

				$_tmp = $x_tag;
			}
		}
		// jedziemy po tablicy
		foreach ( $vals as $xml_elem ) {
			$x_tag   = $xml_elem['tag'];
			$x_level = $xml_elem['level'];
			$x_type  = $xml_elem['type'];
			if ( $x_type == 'open' ) {
				$level[ $x_level ] = $x_tag;
			}

			$start_level = 1;
			$php_stmt    = '$xml_array';
			if ( $x_type == 'close' && $x_level != 1 ) {
				$multi_key[ $x_tag ][ $x_level ]++;
			}

			while ( $start_level < $x_level ) {
				$php_stmt .= '[$level[' . $start_level . ']]';
				if ( isset( $multi_key[ $level[ $start_level ] ][ $start_level ] ) && $multi_key[ $level[ $start_level ] ][ $start_level ] ) {
					$php_stmt .= '[' . ( $multi_key[ $level[ $start_level ] ][ $start_level ] - 1 ) . ']';
				}

				$start_level++;
			}
			$add = '';
			if ( isset( $multi_key[ $x_tag ][ $x_level ] ) && $multi_key[ $x_tag ][ $x_level ] && ( $x_type == 'open' || $x_type == 'complete' ) ) {
				if ( ! isset( $multi_key2[ $x_tag ][ $x_level ] ) ) {
					$multi_key2[ $x_tag ][ $x_level ] = 0;
				} else {
					$multi_key2[ $x_tag ][ $x_level ]++;
				}

				$add = '[' . $multi_key2[ $x_tag ][ $x_level ] . ']';
			}
			if ( isset( $xml_elem['value'] ) && trim( $xml_elem['value'] ) != '' && ! array_key_exists( 'attributes', $xml_elem ) ) {
				if ( $x_type == 'open' ) {
					$php_stmt_main = $php_stmt . '[$x_type]' . $add . '[\'content\'] = $xml_elem[\'value\'];';
				} else {
					$php_stmt_main = $php_stmt . '[$x_tag]' . $add . ' = $xml_elem[\'value\'];';
				}

				eval( $php_stmt_main );
			}
			if ( array_key_exists( 'attributes', $xml_elem ) ) {
				if ( isset( $xml_elem['value'] ) ) {
					$php_stmt_main = $php_stmt . '[$x_tag]' . $add . '[\'content\'] = $xml_elem[\'value\'];';
					eval( $php_stmt_main );
				}
				foreach ( $xml_elem['attributes'] as $key => $value ) {
					$php_stmt_att = $php_stmt . '[$x_tag]' . $add . '[$key] = $value;';
					eval( $php_stmt_att );
				}
			}
		}
		return $xml_array;
	}

	public function isAssoc( array $arr ) {
		if ( [] === $arr ) {
			return false;
		} else {
			return array_keys( $arr ) !== range( 0, count( $arr ) - 1 );
		}
	}
}
