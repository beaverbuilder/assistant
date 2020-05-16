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
		return http.get( `/libraries/${ libraryId }/items` )
	},

	getItem: ( libraryId, itemId ) => {
		return http.get( `/libraries/${ libraryId }/items/${ itemId }` )
	},

	createItem: ( libraryId, data ) => {
		return http.post( `/libraries/${ libraryId }/items`, data )
	},

	updateItem: ( libraryId, itemId, data ) => {
		return http.put( `/libraries/${ libraryId }/items/${ itemId }`, data )
	},

	deleteItem: ( libraryId, itemId ) => {
		return http.delete( `/libraries/${ libraryId }/items/${ itemId }` )
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

	useItem: ( libraryId, itemId ) => {
		const [ item, setItem ] = useState( null )
		useEffect( () => {
			api.getItem( libraryId, itemId ).then( response => setItem( response.data ) )
		}, [ libraryId, itemId ] )
		return [ item, setItem ]
	},
}

export default { ...api, ...hooks }
