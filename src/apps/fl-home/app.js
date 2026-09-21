import React from 'react'
import { Route } from 'react-router-dom'
import * as CloudUI from '@beaverbuilder/cloud-ui'
import { App } from 'assistant/ui'
import { addLeadingSlash } from 'assistant/utils/url'
import { Main, ViewAll, Shell } from './ui'
import { getRequestConfig } from './config'

/**
 * Search result detail screens reuse the same page components the Content and
 * Media apps render, and those pass CloudUI down by hand because system pages
 * can't import it directly (the system bundle treats assistant/data as an
 * external, so importing cloud-ui there is circular). Rendering them here
 * without it left CloudUI undefined and Save to Library threw on
 * CloudUI.Uploader. See #523.
 *
 * Cached per component so the wrapper identity is stable across renders —
 * a fresh function on every render would remount the detail screen.
 */
const detailRenderers = new Map()

const getDetailRenderer = Component => {
	if ( ! detailRenderers.has( Component ) ) {
		detailRenderers.set( Component, props => (
			<Component { ...props } CloudUI={ CloudUI } />
		) )
	}
	return detailRenderers.get( Component )
}

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
								render={ getDetailRenderer( detail.component ) }
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
								render={ getDetailRenderer( detail.component ) }
							/>
						)
					}
				} ) }
			</App.Config>
		</Shell>
	)
}
