import React from 'react'
import { Text } from 'assistant/ui'
import { getSystemConfig } from 'assistant/data'
import { __, sprintf } from '@wordpress/i18n'

const Welcome = () => {
	const { currentUser } = getSystemConfig()
	return (
		<Text.Title
			className="fl-asst-welcome-text"
			subtitle={ __( 'Assistant can help you get quick access to all your most frequent WordPress tasks and content.' ) }
		>
			{ sprintf( 'Welcome, %s', currentUser.displayName ) }
		</Text.Title>
	)
}

export default Welcome
