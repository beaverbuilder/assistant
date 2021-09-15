<?php

namespace FL\Assistant\Hooks\Actions;

use FL\Assistant\Services\CustomizerService;

/**
 * Class OnWPLoaded
 * @package FL\Assistant\Hooks\Actions
 */
class OnWPLoaded {

	public function __invoke() {
		$this->init_customizer_requests();
	}

	protected function init_customizer_requests() {
		if ( isset( $_SERVER['REQUEST_URI'] ) && strstr( $_SERVER['REQUEST_URI'], 'library-items/export/theme-settings' ) ) {
			$service = new CustomizerService;
			$service->init_customizer();
		}
	}
}
