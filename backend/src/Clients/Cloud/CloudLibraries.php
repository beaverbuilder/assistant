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
	public function create_item( $library_id, $data ) {
		$data = $this->normalize_media( $data );
		return $this->client->post( "/libraries/$library_id/library-items", $data );
	}

	/**
	 * @return object
	 */
	public function update_item( $item_id, $data ) {
		$data = $this->normalize_media( $data );
		$data['_method'] = 'PUT';
		return $this->client->post( "/library-items/$item_id", $data );
	}

	/**
	 * @return object
	 */
	public function get_item( $item_id ) {
		return $this->client->get( "/library-items/$item_id" );
	}

	/**
	 * @return array
	 */
	protected function normalize_media( $data ) {
		if ( isset( $data['media'] ) ) {
			foreach ( $data['media'] as $key => $media ) {
				if ( ! $media ) {
					continue;
				} elseif ( is_array( $media ) ) {
					foreach ( $media as $i => $path ) {
						if ( $path && file_exists( $path ) ) {
							$data[ "media[$key][$i]" ] = curl_file_create( $path );
						}
					}
				} elseif ( file_exists( $media ) ) {
					$data[ "media[$key]" ] = curl_file_create( $media );
				}
			}
			unset( $data['media'] );
		}
		return $data;
	}
}
