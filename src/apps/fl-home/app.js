import React from 'react'
import { Route } from 'react-router-dom'
import { App } from 'assistant/ui'
import { addLeadingSlash } from 'assistant/utils/url'
import { Main, ViewAll } from './ui'
import { getRequestConfig } from './config'

// Setup config like this
export default props => {
	const { config } = getRequestConfig()
	const { baseURL } = props
	return (
		<App.Config
			pages={ {
				default: Main,
				'all': ViewAll,
			} }
			{ ...props }
		>
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
	)
}
