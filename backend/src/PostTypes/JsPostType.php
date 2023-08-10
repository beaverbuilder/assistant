<?php

namespace FL\Assistant\PostTypes;

use FL\Assistant\System\Contracts\PostTypeAbstract;
use FL\Assistant\Data\Repository\LabelsRepository;

/**
 * Class JsPostType
 * @package FL\Assistant\PostTypes
 */
class JsPostType extends PostTypeAbstract {

	protected $labels;

	public function __construct( LabelsRepository $labels ) {
		$this->labels = $labels;
	}

	/**
	 * @return void
	 */
	public function register() {
		register_post_type(
			'fl_js', [
				'label'  => __( 'JavaScript', 'fl-assistant' ),
				'public' => true,
				'show_in_menu' => false
			]
		);

		$this->labels->save_defaults();
	}
}
