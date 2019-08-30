<?php


namespace FL\Assistant\Transformers;

use FL\Assistant\Util\HasContainer;

class UserTransformer {
	use HasContainer;

	public function __invoke(\WP_User $user) {
		return $this->transform($user);
	}


	public function transform(\WP_User $user) {
		$date = mysql2date( get_option( 'date_format' ), $user->user_registered );

		return [
			'id'          => $user->ID,
			'content'     => get_the_author_meta( 'description', $user->ID ),
			'date'        => $date,
			'displayName' => $user->display_name,
			'editUrl'     => get_edit_user_link( $user->ID, '' ),
			'email'       => $user->user_email,
			'meta'        => $user->user_email,
			'nicename'    => $user->user_nicename,
			'thumbnail'   => get_avatar_url( $user->ID ),
			'title'       => $user->display_name,
			'url'         => get_author_posts_url( $user->ID ),
			'username'    => $user->user_login,
			'website'     => $user->user_url,
			'posts'       => count_user_posts( $user->ID, 'post' ),
			'pages'       => count_user_posts( $user->ID, 'page' ),
			'firstName'   => get_user_meta( $user->ID, 'first_name', true ),
			'lastName'    => get_user_meta( $user->ID, 'last_name', true ),
			'nickname'    => get_user_meta( $user->ID, 'nickname', true )
		];
	}

}
