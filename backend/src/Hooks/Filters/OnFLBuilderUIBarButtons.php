<?php
namespace FL\Assistant\Hooks\Filters;

/**
* Called on the heartbeat_received action.
*/
class OnFLBuilderUIBarButtons {
	/**
	* @param $buttons Array
	*
	* @return Array
	*/
	public function __invoke( $buttons ) {
		$buttons['fl-assistant'] = [
			'label' => 'Assistant',
			'class' => 'fl-builder-button-silent',
		];
		return $buttons;
	}
}
