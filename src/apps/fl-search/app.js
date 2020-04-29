import React from 'react'
import { Nav } from 'assistant/ui'
import { Main } from './main'
import { ViewAll } from './view-all'
import { addLeadingSlash } from 'assistant/utils/url'
import { getRequestConfig } from './config'

export default () => {
	const baseURL = '/fl-search'
	const { config } = getRequestConfig()
	return (
		<Nav.Switch>
			<Nav.Route exact path={ baseURL } component={ Main } />
			<Nav.Route exact path={ `${baseURL}/all` } component={ ViewAll } />
			{ config.map( ( { detail }, key ) => {
				if ( detail ) {
					return (
						<Nav.Route
							key={ key }
							path={ baseURL + addLeadingSlash( detail.path ) }
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
							path={ `${baseURL}/all` + addLeadingSlash( detail.path ) }
							component={ detail.component }
						/>
					)
				}
			} ) }
		</Nav.Switch>
	)
}
