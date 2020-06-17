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
	public function uploadItemFiles() {
		// TODO: Use $this->client to make request.
	}
}
