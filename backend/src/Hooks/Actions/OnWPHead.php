<?php

namespace FL\Assistant\Hooks\Actions;

use FL\Assistant\Data\Site;
use FL\Assistant\Data\Repository\CodeRepository;

/**
 * Class OnWPHead
 * @package FL\Assistant\Hooks\Actions
 */
class OnWPHead {

	protected $site;

	protected $code;

	public function __construct( Site $site, CodeRepository $code ) {
		$this->site = $site;
		$this->code = $code;
	}

	public function __invoke() {

		$this->get_current_code_items();
	}

	public function get_current_code_items() {

		$current_view = $this->site->get_current_view();
		$result = $this->code->evalute_code_rules( $current_view );

		if ( isset( $result['CSS'] ) ) {
			$this->add_css_code( $result['CSS'] );
		}
		if ( isset( $result['JavaScript'] ) ) {
			$this->add_js_code( $result['JavaScript'] );
		}
	}

	public function add_js_code( $js_data ) {
		
		if ( ! empty( $js_data ) ) {

			foreach ( $js_data as $js ) {

				if ( '' !== $js ) {
					echo '<script type="text/javascript">' . $js . '</script>';
				}
			}
		}
	}

	public function add_css_code( $css ) {

		if ( '' !== $css ) {
			echo '<style type="text/css">' . $css . '</style>';
		}
	}
}
