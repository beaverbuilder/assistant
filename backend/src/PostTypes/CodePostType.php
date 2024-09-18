<?php

namespace FL\Assistant\PostTypes;

use FL\Assistant\System\Contracts\PostTypeAbstract;
use FL\Assistant\Data\Repository\LabelsRepository;

/**
 * Class CodePostType
 * @package FL\Assistant\PostTypes
 */
class CodePostType extends PostTypeAbstract {

	protected $labels;

	public function __construct( LabelsRepository $labels ) {
		$this->labels = $labels;
	}

	/**
	 * @return void
	 */
	public function register() {
		register_post_type(
			'fl_code', [
				'label'  => __( 'Code', 'fl-assistant' ),
				'public' => false,
			]
		);

		$this->labels->save_defaults();
	}
}
