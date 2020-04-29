import React from 'react'
import { Nav } from 'assistant/ui'
import { Main } from './main'
import { ViewAll } from './view-all'
import { addLeadingSlash } from 'assistant/utils/url'
import { getRequestConfig } from './config'

const App = ( { match } ) => {
	const { config } = getRequestConfig()
	return (
		<Nav.Switch>
			<Nav.Route exact path={ `${match.url}/` } component={ Main } />
			<Nav.Route exact path={ `${match.url}/all` } component={ ViewAll } />
			{ config.map( ( { detail }, key ) => {
				if ( detail ) {
					return (
						<Nav.Route
							key={ key }
							path={ match.url + addLeadingSlash( detail.path ) }
							component={ detail.component }
						/>
					)
				}
			} ) }
			{ config.map( ( { detail }, key ) => {
				if ( detail ) {
					return (
						<Nav.Route
							key={ key }
							path={ `${match.url}/all` + addLeadingSlash( detail.path ) }
							component={ detail.component }
						/>
					)
				}
			} ) }
		</Nav.Switch>
	)
}

export default App
