<?php

namespace FL\Assistant\PostTypes;

use FL\Assistant\System\Contracts\PostTypeAbstract;
use FL\Assistant\Data\Repository\NotationsRepository;

/**
 * Class NotationsPostType
 * @package FL\Assistant\PostTypes
 */
class NotationsPostType extends PostTypeAbstract {

	protected $notations;

	public function __construct( NotationsRepository $notations ) {
		$this->notations = $notations;
	}

	/**
	 * @return void
	 */
	public function register() {
		register_post_type(
			'fl_asst_notation', [
				'label'  => __( 'Assistant Notation', 'fl-assistant' ),
				'public' => true,
			]
		);

		register_taxonomy( 'fl_asst_label', [ 'fl_asst_notation' ], [
			'label'             => _x( 'Label', 'Custom taxonomy label.', 'fl-assistant' ),
			'hierarchical'      => false,
			'public'            => true,
			'show_admin_column' => false,
		] );

		$this->notations->save_default_labels();
	}
}
