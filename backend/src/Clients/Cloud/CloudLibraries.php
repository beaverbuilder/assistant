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
		return $this->client->post( "/libraries/$library_id/library-items", $data );
	}

	/**
	 * @return object
	 */
	public function getItem( $item_id ) {
		return $this->client->get( "/library-items/$item_id" );
	}
}
