<?php

namespace FL\Assistant\Hooks\Actions;

use FL\Assistant\Services\CustomizerService;

/**
 * Class OnCustomizeRegister
 * @package FL\Assistant\Hooks\Actions
 */
class OnCustomizeRegister {

	public function __invoke() {
		$this->init_customizer_requests();
	}

	protected function init_customizer_requests() {
		if ( current_user_can( 'edit_theme_options' ) ) {

			if ( isset( $_POST['fl_assistant_export'] ) && is_numeric( $_POST['fl_assistant_export'] ) ) {

				$id = absint( $_POST['fl_assistant_export'] );
				$service = new CustomizerService();
				$response = $service->export_to_cloud( $id );

				wp_send_json( $response );

			} else if ( isset( $_POST['fl_assistant_import'] ) && is_numeric( $_POST['fl_assistant_import'] ) ) {

				$id = absint( $_POST['fl_assistant_import'] );
				$service = new CustomizerService();
				$response = $service->import_from_cloud( $id );

				wp_send_json( $response );
			}
		}
	}
}
