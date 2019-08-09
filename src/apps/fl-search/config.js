import React from 'fl-react'
import { Nav } from 'assistant/ui'
import { addLeadingSlash } from 'assistant/utils/url'
import { getSystemStore } from 'assistant/data'

/**
 * Get routes and route config objects registered by apps.
 */
export const getRequestConfig = ( args = {} ) => {
	const { apps } = getSystemStore().getState()
	const sorted = []
	const config = []
	const routes = []
	const defaults = {
		priority: 1000,
		format: response => response,
	}
	const { keyword, number, offset } = Object.assign( {
		keyword: '',
		number: 5,
		offset: 0,
	}, args )

	const addRequestConfig = search => {
		const route = addLeadingSlash( search.route( keyword, number, offset ) )
		const config = Object.assign( {}, defaults, search )
		const { priority } = config

		if ( ! sorted[ priority ] ) {
			sorted[ priority ] = []
		}

		sorted[ priority ].push( {
			route,
			config,
		} )
	}

	Object.entries( apps ).map( ( data ) => {
		const app = data[ 1 ]
		if ( ! app.search || ! app.search.route ) {
			return
		} else if ( Array.isArray( app.search ) ) {
			app.search.map( search => addRequestConfig( search ) )
		} else {
			addRequestConfig( app.search )
		}
	} )

	sorted.map( groups => {
		groups.map( group => {
			routes.push( group.route )
			config.push( group.config )
		} )
	} )

	return { config, routes }
}

/**
 * Get the props for each item in a results list.
 */
export const getListItemConfig = ( {
	item,
	defaultProps,
	isSection,
	keyword,
	config,
	match,
} ) => {
	const { configKey } = item
	const { detail } = config[ configKey ]
	let props = { ...defaultProps }

	if ( isSection ) {
		props.label = item.label
		props.footer = (
			<Nav.Link to={ {
				pathname: `${match.url}/all`,
				state: { keyword, configKey }
			} }>
				View All
			</Nav.Link>
		)
	} else {
		props.shouldAlwaysShowThumbnail = true

		if ( 'undefined' !== typeof item.label ) {
			props.label = item.label
		} else if ( 'undefined' !== typeof item.title ) {
			props.label = item.title
		}

		if ( 'undefined' !== typeof item.thumbnail ) {
			props.thumbnail = item.thumbnail
		}

		if ( detail ) {
			props.to = {
				pathname: match.url + addLeadingSlash( detail.pathname( item ) ),
				state: { item },
			}
		}
	}

	return props
}
