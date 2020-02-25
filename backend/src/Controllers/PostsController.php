<?php

namespace FL\Assistant\Controllers;

use FL\Assistant\Data\Repository\PostsRepository;
use FL\Assistant\Data\Transformers\PostTransformer;
use FL\Assistant\System\Contracts\ControllerAbstract;
use WP_REST_Request;
use WP_REST_Server;

/**
 * REST API logic for posts.
 */
class PostsController extends ControllerAbstract
{

    protected $posts;
    protected $transformer;

    public function __construct(PostsRepository $posts, PostTransformer $transformer)
    {
        $this->posts = $posts;
        $this->transformer = $transformer;
    }

    /**
     * Register routes.
     */
    public function register_routes()
    {
        $this->route(
            '/posts',
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'posts'],
                    'permission_callback' => function () {
                        return current_user_can('edit_published_posts');
                    },
                ],
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'create_post'],
                    'permission_callback' => function () {
                        return current_user_can('edit_published_posts');
                    },
                ],
            ]
        );

        $this->route(
            '/posts/hierarchical',
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'hierarchical_posts'],
                    'permission_callback' => function () {
                        return current_user_can('edit_published_posts');
                    },
                ],
            ]
        );

        $this->route(
            '/posts/count',
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'posts_count'],
                    'permission_callback' => function () {
                        return current_user_can('edit_published_posts');
                    },
                ],
            ]
        );

        $this->route(
            '/posts/(?P<id>\d+)',
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'post'],
                    'args' => [
                        'id' => [
                            'required' => true,
                            'type' => 'number',
                        ],
                    ],
                    'permission_callback' => function () {
                        return current_user_can('edit_published_posts');
                    },
                ],
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'update_post'],
                    'args' => [
                        'id' => [
                            'required' => true,
                            'type' => 'number',
                        ],
                        'action' => [
                            'required' => true,
                            'type' => 'string',
                        ],
                    ],
                    'permission_callback' => function () {
                        return current_user_can('edit_published_posts');
                    },
                ],
                [
                    'methods' => WP_REST_Server::DELETABLE,
                    'callback' => [$this, 'delete_post'],
                    'args' => [
                        'id' => [
                            'required' => true,
                            'type' => 'number',
                        ],
                    ],
                    'permission_callback' => function () {
                        return current_user_can('edit_published_posts');
                    },
                ],
            ]
        );

        $this->route(
            '/posts/(?P<id>\d+)/clone',
            [
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'clone_post'],
                    'args' => [
                        'id' => [
                            'required' => true,
                            'type' => 'number',
                        ],
                    ],
                    'permission_callback' => function () {
                        return current_user_can('edit_published_posts');
                    },
                ],
            ]
        );

        $this->route(
            '/posts/(?P<id>\d+)/export',
            [
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'export_post'],
                    'permission_callback' => function () {
                        return current_user_can('edit_published_posts');
                    },
                ],
            ]
        );

        $this->route(
            '/posts/deleteExport',
            [
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'delete_export'],
                    'permission_callback' => function () {
                        return current_user_can('edit_published_posts');
                    },
                ],
            ]
        );
    }

    /**
     * Returns an array of posts and related data.
     */
    public function posts(WP_REST_Request $request)
    {

        $params = $request->get_params();

        $params['perm'] = 'editable';

        $pager = $this->posts->paginate($params, $this->transformer);

        return rest_ensure_response($pager->to_array());
    }

    /**
     * Returns an array of posts and related data
     * with child posts contained in the parent
     * post's data array.
     */
    public function hierarchical_posts($request)
    {
        $response = [];
        $children = [];
        $params = $request->get_params();
        $posts = get_posts(
            array_merge(
                $params,
                [
                    'perm' => 'editable',
                ]
            )
        );

        foreach ($posts as $post) {
            if ($post->post_parent) {
                if (!isset($children[$post->post_parent])) {
                    $children[$post->post_parent] = [];
                }
                $children[$post->post_parent][] = $post;
            }
        }

        foreach ($posts as $post) {
            if (!$post->post_parent) {
                $parent = $this->transform($post);
                $parent['children'] = $this->get_child_posts($post, $children);
                $response[] = $parent;
            }
        }

        return rest_ensure_response($response);
    }

    /**
     * Returns an array of response data for a single post.
     */
    public function transform($post)
    {
        return call_user_func($this->transformer, $post);
    }

    /**
     * Returns an array of child posts for the given post.
     * A $children array must be passed to search for children.
     */
    public function get_child_posts($post, $children)
    {
        if (isset($children[$post->ID])) {
            $post_children = $children[$post->ID];
            foreach ($post_children as $i => $child) {
                $post_children[$i] = $this->transform($child);
                $post_children[$i]['children'] = $this->get_child_posts($child, $children);
            }

            return $post_children;
        }

        return [];
    }

    /**
     * Returns an array of counts by post type.
     */
    public function posts_count($request)
    {

        $post_types = $this->posts->get_types();
        $response = [];

        foreach ($post_types as $slug => $label) {
            $counts = wp_count_posts($slug);
            $counts->total = $counts->publish + $counts->draft + $counts->pending + $counts->private + $counts->future;
            $response[$slug] = $counts;
        }

        return rest_ensure_response($response);
    }

    /**
     * Returns data for a single post.
     */
    public function post($request)
    {
        $id = $request->get_param('id');

        if (current_user_can('edit_post', $id)) {
            $post = get_post($id);

            return $this->transform($post);
        }

        return [];
    }

    /**
     * Creates a single post.
     */
    public function create_post($request)
    {
        $id = wp_insert_post($request->get_params());

        if (!$id || is_wp_error($id)) {
            return [
                'error' => true,
            ];
        }

        return $this->transform(get_post($id));
    }

    /**
     * Clones a single post.
     */
    public function clone_post($request)
    {
        global $wpdb;

        $post_id = absint($request->get_param('id'));
        $post = get_post($post_id);
        $current_user = wp_get_current_user();
        $post_data = [
            'comment_status' => $post->comment_status,
            'ping_status' => $post->ping_status,
            'post_author' => $current_user->ID,
            'post_content' => $post->post_content,
            'post_excerpt' => $post->post_excerpt,
            'post_name' => $post->post_name . '-copy',
            'post_parent' => $post->post_parent,
            'post_password' => $post->post_password,
            'post_status' => 'draft',
            /* translators: %s: post/page title */
            'post_title' => sprintf(_x('%s - Copy', '%s stands for post/page title.', 'fl-assistant'), $post->post_title),
            'post_type' => $post->post_type,
            'to_ping' => $post->to_ping,
            'menu_order' => $post->menu_order,
        ];

        $new_post_id = wp_insert_post($post_data);
        $post_meta = $wpdb->get_results($wpdb->prepare("SELECT meta_key, meta_value FROM {$wpdb->postmeta} WHERE post_id = %d", $post_id));
        $taxonomies = get_object_taxonomies($post->post_type);

        if (count($post_meta) !== 0) {
            foreach ($post_meta as $meta_info) {
                $meta_key = $meta_info->meta_key;
                $meta_value = addslashes($meta_info->meta_value);
                $wpdb->query("INSERT INTO {$wpdb->postmeta} (post_id, meta_key, meta_value) values ({$new_post_id}, '{$meta_key}', '{$meta_value}')"); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
            }
        }

        foreach ($taxonomies as $taxonomy) {
            $post_terms = wp_get_object_terms($post_id, $taxonomy);
            for ($i = 0; $i < count($post_terms); $i++) {
                wp_set_object_terms($new_post_id, $post_terms[$i]->slug, $taxonomy, true);
            }
        }

        return $this->transform(get_post($new_post_id));
    }

    /**
     * Updates a single post based on the specified action.
     */
    public function update_post($request)
    {
        $id = $request->get_param('id');
        $action = $request->get_param('action');

        if (!current_user_can('edit_post', $id)) {
            return rest_ensure_response(
                [
                    'error' => true,
                ]
            );
        }

        switch ($action) {
            case 'data':
                $data = (array) $request->get_param('data');
                if (isset($data['meta'])) {
                    $this->update_post_meta($id, $data['meta']);
                    unset($data['meta']);
                }
                if (isset($data['terms'])) {
                    $this->update_post_terms($id, $data['terms']);
                    unset($data['terms']);
                }
                wp_update_post(
                    array_merge(
                        $data,
                        [
                            'ID' => $id,
                        ]
                    )
                );
                break;
            case 'meta':
                $data = (array) $request->get_param('data');
                $this->update_post_meta($id, $data);
                break;
            case 'terms':
                $data = (array) $request->get_param('data');
                $this->update_post_terms($id, $data);
                break;
            case 'trash':
                if (!EMPTY_TRASH_DAYS) {
                    wp_delete_post($id);
                } else {
                    wp_trash_post($id);
                }
                break;
            case 'untrash':
                wp_untrash_post($id);
                break;
        }

        $updated_post = get_post($id);

        return rest_ensure_response(
            [
                'success' => true,
                'post' => $updated_post ? $this->transform($updated_post) : null,
            ]
        );
    }

    /**
     * Updates post meta values for a post.
     */
    public function update_post_meta($id, $meta)
    {
        foreach ($meta as $key => $value) {
            update_post_meta($id, $key, $value);
        }
    }

    /**
     * Updates terms for a post.
     */
    public function update_post_terms($id, $terms)
    {
        foreach ($terms as $taxonomy => $ids) {
            wp_set_post_terms($id, $ids, $taxonomy, false);
        }
    }

    /**
     * Deletes a single post based on the specified ID.
     */
    public function delete_post($request)
    {
        $id = $request->get_param('id');

        if (!current_user_can('edit_post', $id)) {
            return rest_ensure_response(
                [
                    'error' => true,
                ]
            );
        }

        wp_delete_post($id);

        return rest_ensure_response(
            [
                'success' => true,
            ]
        );
    }

    /**
     * Export a single post.
     */
    public function export_post($request)
    {
        /* Get requested post data */
        $post_id = absint( $request->get_param( 'id' ) );
        $post = get_post( $post_id );

        /*Create Temporary file */

        $file_url = FL_ASSISTANT_URL . $post->post_title . '_' . $post->ID . '.xml';
        $file = FL_ASSISTANT_DIR . $post->post_title . '_' . $post->ID . '.xml';

        if ( file_exists( $file ) ) {
            unlink( $file );
            $file = FL_ASSISTANT_DIR . $post->post_title . '_' . $post->ID . '.xml';
        }

        $current = file_get_contents( $file );
        // Append a new post to the file

        /* Creates taxomies string for xml export */

        $taxonomies = get_taxonomies( '', 'names' );
        $terms = wp_get_object_terms( $post->ID, $taxonomies );

        $taxonomies_str = '';
        foreach ( $terms as $term ) {
            $taxonomies_str .= '<category domain="' . $term->taxonomy . '" nicename="' . $term->slug . '"><![CDATA[' . $term->name . ']]></category>';
        }

        /* Creates comments string  */

        $comments = get_comments (array( 'post_id' => $post->ID ) );

        $comment_str = '';

        foreach ( $comments as $comment ) {

            $comment_str .= '<wp:comment>
			<wp:comment_id>' . $comment->comment_ID . '</wp:comment_id>
			<wp:comment_author><![CDATA[' . $comment->comment_author . ']]></wp:comment_author>
			<wp:comment_author_email><![CDATA[' . $comment->comment_author_email . ']]></wp:comment_author_email>
			<wp:comment_author_url></wp:comment_author_url>
			<wp:comment_author_IP><![CDATA[' . $comment->comment_author_ip . ']]></wp:comment_author_IP>
			<wp:comment_date><![CDATA[' . $comment->comment_date . ']]></wp:comment_date>
			<wp:comment_date_gmt><![CDATA[' . $comment->comment_date_gmt . ']]></wp:comment_date_gmt>
			<wp:comment_content><![CDATA[' . $comment->comment_content . ']]></wp:comment_content>
			<wp:comment_approved><![CDATA[' . $comment->comment_approved . ']]></wp:comment_approved>
			<wp:comment_type><![CDATA[]]></wp:comment_type>
			<wp:comment_parent>' . $comment->comment_parent . '</wp:comment_parent>
			<wp:comment_user_id>' . $comment->user_id . '</wp:comment_user_id>
			</wp:comment>
			';
        }

        /* Created Post meta string */

        $meta_str = '';
		$meta_values = get_post_meta($post->ID);
		foreach ($meta_values as $key => $values) {
            foreach ($values as $value) {
                $meta_str .= '<wp:postmeta>
				<wp:meta_key><![CDATA[' . $key . ']]></wp:meta_key>
				<wp:meta_value><![CDATA[ ' . $value . ']]></wp:meta_value>
				</wp:postmeta>
				';
            }
        }

        /* Main content string */

        $post = '<?xml version="1.0" encoding="UTF-8" ?>
		<!-- generator="WordPress/3.9" created="2014-04-25 14:19" -->
	<rss version="2.0"
    	xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
    	xmlns:content="http://purl.org/rss/1.0/modules/content/"
    	xmlns:wfw="http://wellformedweb.org/CommentAPI/"
    	xmlns:dc="http://purl.org/dc/elements/1.1/"
    	xmlns:wp="http://wordpress.org/export/1.2/"
	>

	<channel>
    		<title>' . get_bloginfo('name') . '</title>
    		<link>' . get_bloginfo('url') . '</link>
    		<description>' . get_bloginfo('description') . '</description>
    		<wp:wxr_version>1.2</wp:wxr_version>
    		<wp:base_site_url>' . get_bloginfo('url') . '</wp:base_site_url>
    		<wp:base_blog_url>' . get_bloginfo('url') . '</wp:base_blog_url>
			<generator>http://wordpress.org/?v=3.9</generator>

    	<item>
        	<title>' . $post->post_title . '</title>
        	<link>' . get_the_permalink($post->ID) . '</link>
        	<pubDate>' . $post->post_date . '</pubDate>
        	<dc:creator>' . get_the_author_meta('display_name', $post->post_author) . '</dc:creator>
        	<guid isPermaLink="false">' . $post->guid . '</guid>
        	<description></description>
        	<content:encoded><![CDATA[' . $post->post_content . ']]></content:encoded>
        	<excerpt:encoded><![CDATA[' . $post->post_excerpt . ']]></excerpt:encoded>
        	<wp:post_id>' . $post->ID . '</wp:post_id>
        	<wp:post_date>' . $post->post_date . '</wp:post_date>
        	<wp:post_date_gmt>' . $post->post_date_gmt . '</wp:post_date_gmt>
        	<wp:comment_status>' . $post->comment_status . '</wp:comment_status>
        	<wp:ping_status>' . $post->ping_status . '</wp:ping_status>
        	<wp:post_name>' . $post->post_title . '</wp:post_name>
        	<wp:status>' . $post->post_status . '</wp:status>
        	<wp:post_parent>' . $post->post_parent . '</wp:post_parent>
        	<wp:menu_order>' . $post->menu_order . '</wp:menu_order>
        	<wp:post_type>' . $post->post_type . '</wp:post_type>
        	<wp:post_password></wp:post_password>
        	<wp:is_sticky>0</wp:is_sticky>
			' . $taxonomies_str . '
			' . $comment_str . '
			' . $meta_str . '
		</item>
	</channel>
</rss>
';

        file_put_contents($file, $current . $post);

        return $file_url;
    }

    /**
     * Remove temporary exported file.
     */
    public function delete_export($request)
    {

        $post_id = absint($request->get_param('id'));
        $post = get_post($post_id);

        /*Remove Temporary file */

        $file = FL_ASSISTANT_DIR . $post->post_title . '_' . $post->ID . '.xml';

        if (file_exists($file)) {
            unlink($file);
            return rest_ensure_response(
				[
					'success' => true,
				]
			);
        } else {
			return rest_ensure_response(
				[
					'error' => true,
				]
			);
        }
    }
}
