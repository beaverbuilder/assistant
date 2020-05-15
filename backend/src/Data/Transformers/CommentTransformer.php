<?php


namespace FL\Assistant\Data\Transformers;


class CommentTransformer {
	public function __invoke( \WP_Comment $comment ) {
		$post = get_post( $comment->comment_post_ID );
		$date = mysql2date( get_option( 'date_format' ), $comment->comment_date );
		$time = mysql2date( get_option( 'time_format' ), $comment->comment_date );

		return [
			'approved'    => $comment->comment_approved ? true : false,
			'author'      => $comment->comment_author,
			'authorEmail' => $comment->comment_author_email,
			'authorIP'    => $comment->comment_author_IP,
			'authorUrl'   => get_author_posts_url( $comment->user_id ),
			'content'     => $comment->comment_content,
			'date'        => $date,
			'editUrl'     => admin_url( 'comment.php?action=editcomment&c=' ) . $comment->comment_ID,
			'id'          => $comment->comment_ID,
			'meta'        => $comment->comment_author . ' - ' . $date,
			'postId'      => $post->ID,
			'postTitle'   => $post->post_title,
			'spam'        => 'spam' === $comment->comment_approved,
			'time'        => $time,
			'thumbnail'   => get_avatar_url( $comment->comment_author_email ),
			'title'       => strip_tags( $comment->comment_content ),
			'trash'       => 'trash' === $comment->comment_approved,
			'url'         => get_comment_link( $comment ),
		];
	}
}
