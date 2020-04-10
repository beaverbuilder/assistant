<?php
$xml_data = '<?xml version="1.0" encoding="UTF-8" ?>';
$xml_data .= '<!-- generator="WordPress/3.9" created="2014-04-25 14:19" -->';
$xml_data .= '<rss version="2.0"
    	xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
    	xmlns:content="http://purl.org/rss/1.0/modules/content/"
    	xmlns:wfw="http://wellformedweb.org/CommentAPI/"
    	xmlns:dc="http://purl.org/dc/elements/1.1/"
    	xmlns:wp="http://wordpress.org/export/1.2/"
	>';

	$xml_data .= '<channel>';

	$xml_data .= '<title>assistant</title>';
	$xml_data .= '<link>' . get_bloginfo( 'url' ) . '</link>';
	$xml_data .= '<description>' . get_bloginfo( 'description' ) . '</description>';
	$xml_data .= '<pubDate>' . $data['post']->post_date_gmt . '</pubDate>';
	$xml_data .= '<language>' . get_locale() . '</language>';
	$xml_data .= '<wp:wxr_version>1.2</wp:wxr_version>';
	$xml_data .= '<wp:base_site_url>' . get_bloginfo( 'url' ) . '</wp:base_site_url>';
	$xml_data .= '<wp:base_blog_url>' . get_bloginfo( 'url' ) . '</wp:base_blog_url>';

	$xml_data .= '<wp:author>
	<wp:author_id>' . $data['post']->post_author . '</wp:author_id>
	<wp:author_login><![CDATA[' . get_the_author_meta( 'user_login', $data['post']->post_author ) . ']]></wp:author_login>
	<wp:author_email><![CDATA[' . get_the_author_meta( 'user_email', $data['post']->post_author ) . ']]></wp:author_email>
	<wp:author_display_name><![CDATA[' . get_the_author_meta( 'display_name', $data['post']->post_author ) . ']]></wp:author_display_name>
	<wp:author_first_name><![CDATA[' . get_the_author_meta( 'user_firstname', $data['post']->post_author ) . ']]></wp:author_first_name>
	<wp:author_last_name><![CDATA[' . get_the_author_meta( 'user_lastname', $data['post']->post_author ) . ']]></wp:author_last_name>
	</wp:author>';


	$xml_data .= '<generator>https://wordpress.org/?v=5.3.2</generator>';
	$xml_data .= '<item>';
	$xml_data .= '<title>' . $data['post']->post_title . '</title>';


	$xml_data .= '<pubDate>' . $data['post']->post_date . '</pubDate>
			<dc:creator>' . $data['author_name'] . '</dc:creator>
        	<guid isPermaLink="false">' . $data['post']->guid . '</guid>
        	<description></description>
        	<content:encoded>' . $data['post_content'] . '</content:encoded>
        	<excerpt:encoded>' . $data['post_excerpt'] . '</excerpt:encoded>
        	<wp:post_id> ' . $data['post']->ID . '</wp:post_id>
        	<wp:post_date>' . $data['post_date'] . '</wp:post_date>
        	<wp:post_date_gmt>' . $data['post_date_gmt'] . '</wp:post_date_gmt>
        	<wp:comment_status>' . $data['comment_status'] . '</wp:comment_status>
        	<wp:ping_status>' . $data['ping_status'] . '</wp:ping_status>
        	<wp:post_name>' . $data['post_title'] . '</wp:post_name>
        	<wp:status>' . $data['post_status'] . '</wp:status>
        	<wp:post_parent> ' . $data['post']->post_parent . '</wp:post_parent>
			<wp:menu_order> ' . $data['post']->menu_order . '</wp:menu_order>
			<wp:post_type>' . $data['post_type'] . '</wp:post_type>
        	<wp:post_password></wp:post_password>
        	<wp:is_sticky>0</wp:is_sticky>' . $data['taxonomy_data'] . $data['comment_data'] . $data['meta_data'] . '</item>
	</channel>
</rss>';

echo $xml_data;
