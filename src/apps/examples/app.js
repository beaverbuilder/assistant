import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Nav, Page } from 'assistant/ui'
import './style.scss'

import { FormExamples } from './forms'
import FLUIDExamples from './fluid'
import WPComponentsExamples from './wp-components'

export default ( { baseURL } ) => (
	<Nav.Switch>
		<Nav.Route exact path={ baseURL } component={ Main } />
		<Nav.Route path={ `${baseURL}/forms` } component={ FormExamples } />
		<Nav.Route path={ `${baseURL}/fluid` } component={ FLUIDExamples } />
		<Nav.Route path={ `${baseURL}/wp-components` } component={ WPComponentsExamples } />
	</Nav.Switch>
)

const Main = ( { match } ) => {
	return (
		<Page title="App Examples">
			<Button.Group direction='column'>
				<Button to={ `${match.url}/fluid` }>{__( 'FLUID Examples' )}</Button>
				<Button to={ `${match.url}/forms` }>{__( 'Form Examples' )}</Button>
				<Button to={ `${match.url}/wp-components` }>{__( 'WP Components' )}</Button>
			</Button.Group>
		</Page>
	)
}
