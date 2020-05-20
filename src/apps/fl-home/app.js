import React from 'react'
import { __ } from '@wordpress/i18n'
import { App } from 'assistant/ui'
import { Main } from './ui'

// Setup config like this
export default props => (
	<App.Config
		pages={ {
			default: Main
		} }
		{ ...props }
	/>
)
