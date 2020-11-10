import { getSystemActions } from 'assistant/data'
import { __ } from '@wordpress/i18n'

const renderSkipLink = () => {
	const { setWindow } = getSystemActions()

	const skip = document.createElement( 'button' )
	skip.classList.add( 'skip-link', 'fl-asst-screen-reader-text' )
	skip.innerText = __( 'Skip to Assistant' )
	skip.tabIndex = 1

	skip.addEventListener( 'click', () => {
		setWindow( { isHidden: false } )

		// Move focus
		const closeBtn = document.getElementById( 'fl-asst-close-panel' )
		if ( closeBtn ) {
			closeBtn.focus()
		}
	} )

	document.body.prepend( skip )
}

export default renderSkipLink
