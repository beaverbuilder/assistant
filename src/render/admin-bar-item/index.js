import { toggleUI } from 'assistant'
import './style.scss'

document.addEventListener( 'DOMContentLoaded', () => {
	const el = document.querySelector( '#wp-admin-bar-fl_assistant_toggle_ui' )
	if ( el ) {
		el.addEventListener( 'click', toggleUI )
	}
} )
