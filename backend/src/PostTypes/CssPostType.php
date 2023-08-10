<?php

namespace FL\Assistant\PostTypes;

use FL\Assistant\System\Contracts\PostTypeAbstract;
use FL\Assistant\Data\Repository\LabelsRepository;

/**
 * Class CssPostType
 * @package FL\Assistant\PostTypes
 */
class CssPostType extends PostTypeAbstract {

	protected $labels;

	public function __construct( LabelsRepository $labels ) {
		$this->labels = $labels;
	}

	/**
	 * @return void
	 */
	public function register() {
		register_post_type(
			'fl_css', [
				'label'  => __( 'CSS', 'fl-assistant' ),
				'public' => true,
				'show_in_menu' => false
			]
		);

		$this->labels->save_defaults();
	}
}
