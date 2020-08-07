<?php

namespace FL\Assistant\Clients\Cloud;

class CloudLibraries {

	/**
	 * @var CloudClient
	 */
	protected $client;

	/**
	 * @param CloudClient $client
	 * @return void
	 */
	public function __construct( CloudClient $client ) {
		$this->client = $client;
	}

	/**
	 * @return object
	 */
	public function createItem( $library_id, $data ) {

		if ( isset( $data['media'] ) ) {
			foreach ( $data['media'] as $key => $media ) {
				if ( ! $media ) {
					continue;
				} elseif ( is_array( $media ) ) {
					foreach ( $media as $i => $path ) {
						$data[ "media[$key][$i]" ] = curl_file_create( $path );
					}
				} else {
					$data[ "media[$key]" ] = curl_file_create( $media );
				}
			}
			unset( $data['media'] );
		}

		return $this->client->post( "/libraries/$library_id/library-items", $data );
	}

	/**
	 * @return object
	 */
	public function getItem( $item_id ) {
		return $this->client->get( "/library-items/$item_id" );
	}
}
