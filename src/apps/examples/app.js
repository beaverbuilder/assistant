import React from 'react'
import { __ } from '@wordpress/i18n'
import { App, Button, Page } from 'assistant/ui'
import './style.scss'

import { FormExamples } from './forms'
import FLUIDExamples from './fluid'
import WPComponentsExamples from './wp-components'
import TestsPage from './tests'

export default props => (
	<App.Config
		pages={ {
			default: Main,
			forms: FormExamples,
			fluid: FLUIDExamples,
			tests: TestsPage,
			'wp-components': WPComponentsExamples
		} }
		{ ...props }
	/>
)

const Main = ( { baseURL } ) => {
	return (
		<Page title="App Examples">
			<Button.Group direction='column'>
				<Button to={ `${baseURL}/fluid` }>{__( 'FLUID Examples' )}</Button>
				<Button to={ `${baseURL}/forms` }>{__( 'Form Examples' )}</Button>
				<Button to={ `${baseURL}/tests` }>{__( 'UI Tests' )}</Button>
				<Button to={ `${baseURL}/wp-components` }>{__( 'WP Components' )}</Button>
			</Button.Group>
		</Page>
	)
}
