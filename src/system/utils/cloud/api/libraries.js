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

	getItems: ( libraryId ) => {
		return http.get( `/libraries/${ libraryId }/library-items` )
	},

	getItem: ( itemId ) => {
		return http.get( `/library-items/${ itemId }` )
	},

	createItem: ( libraryId, data ) => {
		return http.post( `/libraries/${ libraryId }/library-items`, data )
	},

	updateItem: ( itemId, data ) => {
		return http.put( `/library-items/${ itemId }`, data )
	},

	deleteItem: ( itemId ) => {
		return http.delete( `/library-items/${ itemId }` )
	},
}

const hooks = {

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

	useItems: ( libraryId ) => {
		const [ items, setItems ] = useState( null )
		useEffect( () => {
			setItems( null )
			api.getItems( libraryId ).then( response => setItems( response.data ) )
		}, [ libraryId ] )
		return [ items, setItems ]
	},

	useItem: ( itemId ) => {
		const [ item, setItem ] = useState( null )
		useEffect( () => {
			api.getItem( itemId ).then( response => setItem( response.data ) )
		}, [ itemId ] )
		return [ item, setItem ]
	},
}

export default { ...api, ...hooks }
