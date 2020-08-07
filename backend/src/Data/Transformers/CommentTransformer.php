<?php


namespace FL\Assistant\Data\Transformers;


class CommentTransformer {
	public function __invoke( \WP_Comment $comment ) {
		$post = get_post( $comment->comment_post_ID );
		$date = mysql2date( get_option( 'date_format' ), $comment->comment_date );
		$time = mysql2date( get_option( 'time_format' ), $comment->comment_date );

		return [
			'id'          => $comment->comment_ID,
			'title'       => strip_tags( $comment->comment_content ),
			'content'     => $comment->comment_content,
			'meta'        => $comment->comment_author . ' - ' . $date,

			// Date
			'date'        => $date,
			'time'        => $time,
			'timeDiff'    => human_time_diff( strtotime( $comment->comment_date ) ),

			// Status
			'approved'    => $comment->comment_approved ? true : false,
			'spam'        => 'spam' === $comment->comment_approved,
			'trash'       => 'trash' === $comment->comment_approved,

			// URLs
			'url'         => get_comment_link( $comment ),
			'editUrl'     => admin_url( 'comment.php?action=editcomment&c=' ) . $comment->comment_ID,

			// Author Meta
			'authorName'  => $comment->comment_author,
			'authorEmail' => $comment->comment_author_email,
			'authorIP'    => $comment->comment_author_IP,
			'authorURL'   => get_comment_author_url( $comment->comment_ID ),
			'thumbnail'   => get_avatar_url( $comment->comment_author_email ),

			'author'      => [
				'name'   => $comment->comment_author,
				'email'  => $comment->comment_author_email,
				'ip'     => $comment->comment_author_IP,
				'url'    => get_comment_author_url( $comment->comment_ID ),
				'avatar' => get_avatar_url( $comment->comment_author_email ),
			],

			// Post Meta
			'postId'      => $post->ID,
			'postTitle'   => $post->post_title,
			'post'        => [
				'id'        => $post->ID,
				'title'     => $post->post_title,
				'thumbnail' => '',
			],
		];
	}
}
