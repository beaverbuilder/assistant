import { useEffect, useState } from 'react'

export default ( http ) => {

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

		/**
		 * Collection specific methods
		 */
		getCollections: ( libraryId ) => {
			return http.get( `/libraries/${ libraryId }/library-collections` )
		},

		getCollection: ( collectionId ) => {
			return http.get( `/library-collections/${ collectionId }` )
		},

		createCollection: ( libraryId, data ) => {
			return http.post( `/libraries/${ libraryId }/library-collections`, data )
		},

		updateCollection: ( collectionId, data ) => {
			return http.put( `/library-collections/${ collectionId }`, data )
		},

		deleteCollection: ( collectionId ) => {
			return http.delete( `/library-collections/${ collectionId }` )
		},

		/**
		 * Item specific methods
		 */
		getItems: ( libraryId, params = {} ) => {
			return http.get( `/libraries/${ libraryId }/library-items`, { params } )
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

		/**
		 * Collection specific hooks
		 */
		useCollections: ( libraryId ) => {
			const [ collections, setCollections ] = useState( null )
			useEffect( () => {
				setCollections( null )
				api.getCollections( libraryId ).then( response => setCollections( response.data ) )
			}, [ libraryId ] )
			return [ collections, setCollections ]
		},

		useCollection: ( collectionId ) => {
			const [ collection, setCollection ] = useState( null )
			useEffect( () => {
				api.getCollection( collectionId ).then( response => setCollection( response.data ) )
			}, [ collectionId ] )
			return [ collection, setCollection ]
		},

		/**
		 * Item specific hooks
		 */
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

	return { ...api, ...hooks }
}
