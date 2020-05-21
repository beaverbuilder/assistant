import React from 'react'
import { __ } from '@wordpress/i18n'
import { App, Button, Page } from 'assistant/ui'
import './style.scss'

import FLUIDExamples from './fluid'

export default props => (
	<App.Config
		pages={ {
			default: Main,
			fluid: FLUIDExamples,
		} }
		{ ...props }
	/>
)

const Main = ( { baseURL } ) => {
	return (
		<Page title="App Examples">
			<Button.Group direction='column'>
				<Button to={ `${baseURL}/fluid` }>{__( 'FLUID Examples' )}</Button>
			</Button.Group>
		</Page>
	)
}
