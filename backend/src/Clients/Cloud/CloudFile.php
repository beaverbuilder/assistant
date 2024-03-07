<?php

namespace FL\Assistant\Clients\Cloud;

class CloudFile {
  public $path;
  public $filename;
  public $mime_type;

  public function __construct( $path, $filename = null, $mime_type = null ) {
    $this->path = $path;
    $this->filename = $filename ?? basename( $path );
    $this->mime_type = $mime_type ?? mime_content_type( $path );
  }

  public function get_contents() {
    return file_get_contents( $this->path );
  }
}