import React from 'fl-react'
import { Nav } from 'assistant/ui'
import { addLeadingSlash } from 'assistant/utils/url'
import { getSystemStore } from 'assistant/data'
import { __ } from '@wordpress/i18n'

/**
 * Number of results per group for the main search list.
 */
const NUMBER_OF_RESULTS = 5

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
		number: NUMBER_OF_RESULTS,
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
		if ( ! app.search ) {
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
 * Get the props for each section in a results list.
 */
export const getListSectionConfig = ( {
	section,
	defaultProps,
	keyword,
	match,
} ) => {
	const { configKey } = section
	let props = { ...defaultProps }

	if ( section.items.length >= NUMBER_OF_RESULTS ) {
		props.footer = (
			<Nav.ButtonLink to={ {
				pathname: `${match.url}/all`,
				state: { keyword, configKey }
			} }>{__( 'View All' )}</Nav.ButtonLink>
		)
	}

	return props
}

/**
 * Get the props for each item in a results list.
 */
export const getListItemConfig = ( {
	item,
	defaultProps,
	config,
	match,
} ) => {
	const { configKey } = item
	const { detail } = config[ configKey ]
	let props = { ...defaultProps }

	props.shouldAlwaysShowThumbnail = true
	props.thumbnailSize = 'sm'

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

	return props
}
