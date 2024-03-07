<?php

namespace FL\Assistant\Clients\Cloud;

use RecursiveIteratorIterator;
use RecursiveArrayIterator;

class CloudRequest {
		
	/**
	 * Same as wp_safe_remote_request but adds the ability to send a multipart/form-data
	 * request with file attachments by using the CloudFile class.
	 * 
	 * @param string $url
	 * @param array $args
	 * @return array|WP_Error
	 */
	public static function request( $url, $args = [] ) {
		if ( ! isset( $args['method'] ) ) {
			$args['method'] = 'GET';
		}

		if ( ! isset( $args['headers'] ) ) {
			$args['headers'] = [];
		}

    // If the body contains a CloudFile instance, send request as multipart/form-data.
    if ( is_array( $args['body'] ) && static::has_cloudfile( $args['body'] ) ) {
      $boundary = '----FormBoundary' . md5( time() );
			$args['headers']['Content-Type'] = 'multipart/form-data; boundary=' . $boundary;
      $form_data = static::convert_multidimensional_array_to_brackets( $args['body'] );
      $args['body'] = '';

      foreach ( $form_data as $key => $value ) {
        if ( $value instanceof CloudFile ) {
          $cloud_file = $value;
          $args['body'] .= "--$boundary\r\n";
          $args['body'] .= "Content-Disposition: form-data; name=\"$key\"; filename=\"" . $cloud_file->filename . "\"\r\n";
          $args['body'] .= "Content-Type: " . $cloud_file->mime_type . "\r\n";
          $args['body'] .= "\r\n";
          $args['body'] .= $cloud_file->get_contents() . "\r\n";
        } else {
          $args['body'] .= "--$boundary\r\n";
          $args['body'] .= "Content-Disposition: form-data; name=\"$key\"\r\n";
          $args['body'] .= "\r\n";
          $args['body'] .= "$value\r\n";
        }
      }

      $args['body'] .= "--$boundary--\r\n";
    } 
		
		return wp_safe_remote_request( $url, $args );
	}

	/**
	 * Convert multidimensional array to a flat array with bracketed keys.
	 * 
	 * Ex:
	 * [
	 *   'foo' => [
	 *      'bar' => 'baz'
	 *   ],
	 *   'x' => 'y'
	 * ]
	 * converts to
	 * [
	 *   'foo[bar]' => 'baz', 
	 *    'x' => 'y'
	 * ]
	 * 
	 * @param array $arr
	 * @return array
	 */
	protected static function convert_multidimensional_array_to_brackets( $arr ) {
		$iterator = new RecursiveIteratorIterator( new RecursiveArrayIterator( $arr, RecursiveArrayIterator::CHILD_ARRAYS_ONLY ) );
		$result = [];

		foreach ( $iterator as $value ) {
    	$newKey = $iterator->getSubIterator(0)->key();
    
      if ( $iterator->getDepth() > 0 ) {
        foreach ( range(1, $iterator->getDepth() ) as $depth ) {
          $newKey .= '[' . $iterator->getSubIterator( $depth )->key() . ']';
        }
      }

			$result[$newKey] = $value;
    }

		return $result;
	}

  /**
   * Check if an array contains a CloudFile instance.
   * 
   * @param array $arr
   * @return bool
   */
  protected static function has_cloudfile( $arr ) {
    $iterator = new RecursiveIteratorIterator( new RecursiveArrayIterator( $arr, RecursiveArrayIterator::CHILD_ARRAYS_ONLY ) );

		foreach ($iterator as $value) {
      if ( $value instanceof CloudFile ) {
        return true;
      }
    }

    return false;
  }
}
