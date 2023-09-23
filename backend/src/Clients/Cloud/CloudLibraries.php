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
		$remaining = $this->convert_media_to_chunks( $data );
		$result = $this->client->post( "/libraries/$library_id/library-items", $data );
		$this->upload_remaining_media_chunks( $result->id, $remaining );
		return $result;
	}

	/**
	 * @return object
	 */
	public function update_item( $item_id, $data ) {
		$data['_method'] = 'PUT';
		$remaining = $this->convert_media_to_chunks( $data );
		$result = $this->client->post( "/library-items/$item_id", $data );
		$this->upload_remaining_media_chunks( $item_id, $remaining );
		return $result;
	}

	/**
	 * @return object
	 */
	public function get_item( $item_id ) {
		return $this->client->get( "/library-items/$item_id?include_post_data=1" );
	}

	/**
	 * @return void
	 */
	public function upload_remaining_media_chunks( $item_id, $chunks ) {
		for ( $i = 0; $i < count( $chunks ); $i++ ) {
			$data = array_merge( $chunks[ $i ],
				[
					'_method' => 'PUT',
					'preserve_media' => true,
				]
			);
			$this->client->post( "/library-items/$item_id", $data );
		}
	}

	/**
	 * @return array
	 */
	protected function convert_media_to_chunks( &$data ) {
		$max_uploads = ini_get( 'max_file_uploads' );
		$files = [];

		// Handle the post thumb - must come first.
		if ( isset( $data['media']['thumb'] ) ) {
			if ( file_exists( $data['media']['thumb'] ) ) {
				$files['media[thumb]'] = curl_file_create( $data['media']['thumb'] );
			} else {
				$files['media[thumb]'] = null;
			}
		}

		// Handle image file export.
		if ( isset( $data['media']['file'] ) ) {
			if ( file_exists( $data['media']['file'] ) ) {
				$files['media[file]'] = curl_file_create( $data['media']['file'] );
			}
		}

		// Handle post attachments.
		if ( isset( $data['media']['attachments'] ) ) {
			if ( empty( $data['media']['attachments'] ) ) {
				$files['media[attachments]'] = null;
			} else {
				foreach ( $data['media']['attachments'] as $i => $path ) {
					if ( $path && file_exists( $path ) ) {
						$files[ "media[attachments][$i]" ] = curl_file_create( $path );
					}
				}
			}
		}

		// Unset the original media array.
		unset( $data['media'] );

		// Convert media files to chunks. Send the first chunk with the data.
		$chunks = array_chunk( $files, $max_uploads, true );

		if ( isset( $chunks[0] ) ) {
			$data = array_merge( $data, $chunks[0] );
			array_shift( $chunks );
		}

		return $chunks;
	}
}
