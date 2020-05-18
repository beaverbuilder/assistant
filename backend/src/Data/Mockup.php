<?php
namespace FL\Assistant\Data;

class Mockup {

    static public function get() {
        return [
			'libraries' => self::get_libraries(),
		];
    }

	static private function get_libraries() {
        $libs = [];

        $libs_dir = FL_ASSISTANT_DIR . 'backend/mockup/libraries/';

        foreach( glob( $libs_dir . '*', GLOB_ONLYDIR ) as $path ) {
            $manifest = json_decode( file_get_contents( $path . '/manifest.json' ) );
            $libs[] = $manifest;
        }

        return $libs;
    }
}
