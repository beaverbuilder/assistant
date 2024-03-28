<?php

namespace FL\Assistant\Hooks\Actions;

use FL\Assistant\Hooks\Actions\OnWP;

/**
 * Class OnWP
 * @package FL\Assistant\Hooks\Actions
 */
class OnWP {

	public function __invoke() {

		if ( get_option( 'fl_assistant_export_file' ) ) {

			$upload_dir = wp_upload_dir( null, false );
			$files = glob( trailingslashit( $upload_dir['basedir'] ) . 'assistant_export_*.xml' );

			foreach ( $files as $file ) {
				unlink( $file );
			}
			delete_option( 'fl_assistant_export_file' );
		}
	}
}
