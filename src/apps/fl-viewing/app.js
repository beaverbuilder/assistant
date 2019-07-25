import React from 'fl-react'
import { __ } from 'assistant'
import { Page } from 'assistant/ui'

export const App = () => {

	return (
		<Page title="Currently Viewing">
			I have no idea what you're looking at.
		</Page>
	)
}

export const AppIcon = () => {
	return (
		<svg width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<g stroke="none" fill="currentColor" fillRule="evenodd">
				<path d="M8.9955,0 C4.023,0 0,4.0275 0,9 C0,13.9725 4.023,18 8.9955,18 C13.968,18 18,13.9725 18,9 C18,4.0275 13.968,0 8.9955,0 Z M12.7105263,15 L9,12.6461538 L5.28947368,15 L6.27192982,10.56 L3,7.57384615 L7.31578947,7.18615385 L9,3 L10.6842105,7.18615385 L15,7.57384615 L11.7280702,10.56 L12.7105263,15 Z"></path>
			</g>
		</svg>
	)
}
