import { addLeadingSlash } from 'assistant/utils/url'
import { getSystemStore } from 'assistant/data'

export const getRequestConfig = (
	keyword = '',
	number = 5,
	offset = 0,
	key = false
) => {
	const { apps } = getSystemStore().getState()
	const config = []
	const routes = []
	const defaults = {
		priority: 1000,
		format: response => response,
	}
	const addRequestConfig = search => {
		config.push( Object.assign( {}, defaults, search ) )
		routes.push( addLeadingSlash( search.route( keyword, number, offset ) ) )
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

	if ( false === key ) {
		return {
			config,
			routes
		}
	}

	return {
		config: config[ key ],
		routes: routes[ key ]
	}
}
