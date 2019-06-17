<?php


namespace FL\Assistant\Actions;


class OnPluginActivate {
	public function __invoke() {
		do_action( 'fl_assistant_activate' );
	}
}
