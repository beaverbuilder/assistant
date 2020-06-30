import { useEffect, useState, useCallback } from 'react'
import { useApiResource, useApiCollection } from '../hooks'
import * as session from '../session'

export default ( http, sockets ) => {

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

		subscribe: ( id, event, callback ) => {
			if ( id ) {
				sockets.private( `library.${ id }` ).listen( `.library.${ event }`, callback )
			} else {
				sockets.private( `libraries.${ session.getUser().id }` ).listen( `.library.${ event }`, callback )
			}
		},

		unsubscribe: ( id ) => {
			sockets.leave( `library.${ id }` )
			sockets.leave( `libraries.${ session.getUser().id }` )
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

		useAll: ( teamId = 0 ) => useApiCollection( {
			model: 'library',
			getter: useCallback( () => api.getAll( teamId ), [ teamId ] ),
			subscribe: api.subscribe,
			unsubscribe: api.unsubscribe
		} ),

		useOne: ( id ) => useApiResource( id, {
			model: 'library',
			getter: api.get,
			subscribe: api.subscribe,
			unsubscribe: api.unsubscribe
		} ),

		/**
		 * Collection specific hooks
		 */
 		useCollections: ( libraryId ) => useApiCollection( {
 			getter: useCallback( () => api.getCollections( libraryId ), [ libraryId ] )
 		} ),

		useCollection: ( id ) => useApiResource( id, {
			getter: api.getCollection
		} ),

		/**
		 * Item specific hooks
		 */
 		useItems: ( libraryId ) => useApiCollection( {
 			getter: useCallback( () => api.getItems( libraryId ), [ libraryId ] )
 		} ),

		useItem: ( id ) => useApiResource( id, {
			getter: api.getItem
		} ),
	}

	return { ...api, ...hooks }
}
