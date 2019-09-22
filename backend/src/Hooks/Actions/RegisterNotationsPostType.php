<?php

namespace FL\Assistant\Hooks\Actions;


/**
 * Class RegisterNotationsPostType
 * @package FL\Assistant\Hooks\Actions
 *
 */
class RegisterNotationsPostType {

	/**
	 * @return void
	 */
	public function __invoke() {
		$this->register_notation_post_type();
	}

	/**
	 * @return void
	 */
	private function register_notation_post_type() {
		register_post_type(
			'fl_asst_notation', [
				'label'  => __( 'Assistant Notation', 'fl-assistant' ),
				'public' => false,
			]
		);
	}
}
