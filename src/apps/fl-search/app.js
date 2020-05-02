import React from 'react'
import { Route } from 'react-router-dom'
import { App } from 'assistant/ui'
import Main from './main'
import { ViewAll } from './view-all'
import { addLeadingSlash } from 'assistant/utils/url'
import { getRequestConfig } from './config'

export default props => {
	const { baseURL } = props
	const { config } = getRequestConfig()

	console.log('render search')

	return (
		<>
		<App.Config
			pages={ {
				default: Main,
			} }
			{ ...props }
		>
			<Route exact path={ `${baseURL}/all` } component={ ViewAll } />

			{ config.map( ( { detail }, key ) => {
				if ( detail ) {
					return (
						<Route
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
						<Route
							key={ key }
							path={ `${baseURL}/all` + addLeadingSlash( detail.path ) }
							component={ detail.component }
						/>
					)
				}
			} ) }
		</App.Config>
		</>
	)
}
