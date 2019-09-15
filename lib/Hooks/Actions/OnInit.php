<?php

namespace FL\Assistant\Hooks\Actions;

use FL\Assistant\Util\HasContainer;

/**
 * Class OnInit
 * @package FL\Assistant\Hooks\Actions
 *
 */
class OnInit {

	use HasContainer;

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
		register_post_type( 'fl_asst_notation', array(
			'label'  => __( 'Assistant Notation', 'fl-assistant' ),
			'public' => false,
		) );
	}
}
