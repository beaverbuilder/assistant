import { toggleUI } from 'assistant'

document.addEventListener( 'DOMContentLoaded', () => {
	const el = document.querySelector( '#wp-admin-bar-fl_assistant_toggle_ui' )
	if ( el ) {
		el.addEventListener( 'click', toggleUI )
	}
} )
