import { addLeadingSlash } from 'assistant/utils/url'
import { getSystemStore } from 'assistant/data'

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
