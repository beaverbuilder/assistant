import { useEffect, useState } from 'react'
import http from '../http'

const api = {

	getAll: ( teamId = 0 ) => {
		if ( teamId ) {
			return http.get( `/libraries?team_id=${ teamId }` )
		} else {
			return http.get( '/libraries' )
		}
	},

	get: ( id ) => {
		return http.get( `/libraries/${ id }` )
	},

	create: ( data ) => {
		return http.post( '/libraries', data )
	},

	update: ( id, data ) => {
		return http.put( `/libraries/${ id }`, data )
	},

	delete: ( id ) => {
		return http.delete( `/libraries/${ id }` )
	},

	useAll: ( teamId = 0 ) => {
		const [ libraries, setLibraries ] = useState( null )
		useEffect( () => {
			setLibraries( null )
			api.getAll( teamId ).then( response => setLibraries( response.data ) )
		}, [ teamId ] )
		return [ libraries, setLibraries ]
	},

	useOne: ( id ) => {
		const [ library, setLibrary ] = useState( null )
		useEffect( () => {
			if ( id ) {
				api.get( id ).then( response => setLibrary( response.data ) )
			}
		}, [ id ] )
		return [ library, setLibrary ]
	},
}

export default api
