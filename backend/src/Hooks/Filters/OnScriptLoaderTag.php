<?php
namespace FL\Assistant\Hooks\Filters;

/**
* Called on the heartbeat_received action.
*/
class OnScriptLoaderTag {
	/**
	* @param $tag String - empty by default
	* @param $handle String - handle for the enqueued script
	* @param $src String - url of the enqueued script
	* @return String
	*/
	public function __invoke( $tag, $handle, $src ) {

		$handles = [
			'fl-assistant',
			'fl-assistant-render',
			'fl-assistant-apps'
		];

		if ( in_array( $handle, $handles ) ) {
			$tag = '<script type="module" src="' . $src . '"></script>';
		}
		return $tag;
	}
}
