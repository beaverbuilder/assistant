import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Nav, Page } from 'assistant/ui'
import './style.scss'

import { FormExamples } from './forms'
import FLUIDExamples from './fluid'
import WPComponentsExamples from './wp-components'

const App = ( { match } ) => (
	<Nav.Switch>
		<Nav.Route exact path={ `${match.url}/` } component={ Main } />
		<Nav.Route path={ `${match.url}/forms` } component={ FormExamples } />
		<Nav.Route path={ `${match.url}/fluid` } component={ FLUIDExamples } />
		<Nav.Route path={ `${match.url}/wp-components` } component={ WPComponentsExamples } />
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

export default App
