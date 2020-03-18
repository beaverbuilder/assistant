<?xml version="1.0" encoding="UTF-8" ?>
		<!-- generator="WordPress/3.9" created="2014-04-25 14:19" -->
	<rss version="2.0"
    	xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
    	xmlns:content="http://purl.org/rss/1.0/modules/content/"
    	xmlns:wfw="http://wellformedweb.org/CommentAPI/"
    	xmlns:dc="http://purl.org/dc/elements/1.1/"
    	xmlns:wp="http://wordpress.org/export/1.2/"
	>

	<channel>
    		<title> <?php echo get_bloginfo('name'); ?></title>
    		<link> <?php echo get_bloginfo('url'); ?></link>
    		<description <?php echo get_bloginfo('description'); ?></description>
    		<wp:wxr_version>1.2</wp:wxr_version>
    		<wp:base_site_url <?php echo get_bloginfo('url'); ?></wp:base_site_url>
    		<wp:base_blog_url> <?php echo get_bloginfo('url'); ?></wp:base_blog_url>
			<generator>http://wordpress.org/?v=3.9</generator>

    	<item>
        	<title> <?php echo $post->post_title; ?></title>
        	<link> <?php echo get_the_permalink($post->ID); ?></link>
        	<pubDate> <?php echo $post->post_date; ?></pubDate>
        	<dc:creator> <?php echo get_the_author_meta('display_name', $post->post_author); ?></dc:creator>
        	<guid isPermaLink="false"> <?php echo $post->guid; ?></guid>
        	<description></description>
        	<content:encoded><![CDATA[ <?php echo $post->post_content; ?>]]></content:encoded>
        	<excerpt:encoded><![CDATA[ <?php echo $post->post_excerpt; ?>]]></excerpt:encoded>
        	<wp:post_id> <?php echo $post->ID; ?></wp:post_id>
        	<wp:post_date> <?php echo $post->post_date; ?></wp:post_date>
        	<wp:post_date_gmt> <?php echo $post->post_date_gmt; ?></wp:post_date_gmt>
        	<wp:comment_status> <?php echo $post->comment_status; ?></wp:comment_status>
        	<wp:ping_status> <?php echo $post->ping_status; ?></wp:ping_status>
        	<wp:post_name> <?php echo $post->post_title; ?></wp:post_name>
        	<wp:status> <?php echo $post->post_status; ?></wp:status>
        	<wp:post_parent> <?php echo $post->post_parent; ?></wp:post_parent>
        	<wp:menu_order> <?php echo $post->menu_order; ?></wp:menu_order>
        	<wp:post_type> <?php echo $post->post_type; ?></wp:post_type>
        	<wp:post_password></wp:post_password>
        	<wp:is_sticky>0</wp:is_sticky>
			<?php echo $taxonomies_data; ?>
			<?php echo $comment_data; ?>
			<?php echo $meta_data; ?>
		</item>
	</channel>
</rss>
