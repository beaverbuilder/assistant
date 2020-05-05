<?php
namespace FL\Assistant\Data;

class Libraries {

    static public function get() {
        $libs = [];

        $libs_dir = FL_ASSISTANT_DIR . 'backend/libraries/';

        foreach( glob( $libs_dir . '*', GLOB_ONLYDIR ) as $path ) {
            $name = basename( $path );
            $manifest = json_decode( file_get_contents( $path . '/manifest.json' ) );
            $libs[ $name ] = $manifest;
        }

        return $libs;
    }
}
