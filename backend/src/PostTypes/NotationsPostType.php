<?php

namespace FL\Assistant\PostTypes;

use FL\Assistant\System\Contracts\PostTypeAbstract;

/**
 * Class NotationsPostType
 * @package FL\Assistant\PostTypes
 */
class NotationsPostType extends PostTypeAbstract {

	/**
	 * @return void
	 */
	public function register() {
		register_post_type(
			'fl_asst_notation', [
				'label'  => __( 'Assistant Notation', 'fl-assistant' ),
				'public' => false,
			]
		);

		register_taxonomy( 'fl_asst_label', [ 'fl_asst_notation' ], [
			'label'             => _x( 'Label', 'Custom taxonomy label.', 'fl-assistant' ),
			'hierarchical'      => false,
			'public'            => false,
			'show_admin_column' => false,
		] );
	}
}
