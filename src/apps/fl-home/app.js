import React from 'react'
import { Route } from 'react-router-dom'
import * as CloudUI from '@beaverbuilder/cloud-ui'
import { App } from 'assistant/ui'
import { addLeadingSlash } from 'assistant/utils/url'
import { Main, ViewAll, Shell } from './ui'
import { getRequestConfig } from './config'

/**
 * Search result detail screens reuse the same page components the Content and
 * Media apps render, and those take CloudUI as a prop because system pages
 * can't import it themselves — cloud-ui imports assistant/data, which is an
 * external pointing at the global the system bundle itself defines. Render
 * them without it and Save to Library throws on CloudUI.Uploader. See #523.
 */
const renderDetail = Component => props => (
	<Component { ...props } CloudUI={ CloudUI } />
)

// Setup config like this
export default props => {
	const { config } = getRequestConfig()
	const { baseURL } = props

	return (
		<Shell baseURL={ baseURL }>
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
								render={ renderDetail( detail.component ) }
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
								render={ renderDetail( detail.component ) }
							/>
						)
					}
				} ) }
			</App.Config>
		</Shell>
	)
}
