import React, { Fragment } from 'fl-react'
import { Nav } from 'assistant/ui'
import { Main } from './main'
import { ViewAll } from './view-all'
import { addLeadingSlash } from 'assistant/utils/url'
import { getRequestConfig } from './config'

export const App = ( { match } ) => {
	const { config } = getRequestConfig()
	const rendered = []
	return (
		<Nav.Switch>
			<Nav.Route exact path={ `${match.url}/` } component={ Main } />
			<Nav.Route exact path={ `${match.url}/all` } component={ ViewAll } />
			{ config.map( ( { detail }, key ) => {
				if ( detail ) {
					if ( rendered.includes( detail.path ) ) {
						return null
					} else {
						rendered.push( detail.path )
					}
					return (
						<Fragment key={ key }>
							<Nav.Route
								path={ match.url + addLeadingSlash( detail.path ) }
								component={ detail.component }
							/>
							<Nav.Route
								path={ `${match.url}/all` + addLeadingSlash( detail.path ) }
								component={ detail.component }
							/>
						</Fragment>
					)
				}
			} ) }
		</Nav.Switch>
	)
}

export const AppIcon = () => {
	return (
		<svg width="17px" height="17px" viewBox="0 0 17 17" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<g stroke="currentColor" strokeWidth="2" fill="none" fillRule="evenodd">
				<path d="M6.5,12 C3.46243388,12 1,9.53756612 1,6.5 C1,3.46243388 3.46243388,1 6.5,1 C9.53756612,1 12,3.46243388 12,6.5 C12,9.53756612 9.53756612,12 6.5,12 Z M15.8568331,15.8587942 L10.4910728,10.4930339 L15.8568331,15.8587942 Z"></path>
			</g>
		</svg>
	)
}
