import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { useEffect, useState } from 'react'
import { getCache, setCache } from 'utils/cache'
import { addQueryArgs, getQueryArgs } from 'utils/url'

export const createMockupApi = ( tables, options ) => {
	const { cacheKey, delayResponse, debug } = options
	const cache = getMockupCache( cacheKey )
	const db = cache ? { ...cache } : { ...setupTables( tables ) }
	const http = axios.create()
	const mock = new MockAdapter( http, { delayResponse } )
	const api = {}

	Object.keys( db ).map( key => {
		api[ key ] = {
			getData: () => {
				return [ ...db[ key ] ]
			},
			getAll: ( args = {} ) => {
				return http.get( addQueryArgs( `/${ key }`, args ) )
			},
			get: ( id ) => {
				return http.get( `/${ key }/${ id }` )
			},
			create: ( data ) => {
				return http.post( `/${ key }`, data )
			},
			update: ( id, data ) => {
				return http.put( `/${ key }/${ id }`, data )
			},
			delete: ( id ) => {
				return http.delete( `/${ key }/${ id }` )
			},
			useAll: () => {
				const [ items, setItems ] = useState( null )
				useEffect( () => {
					api[ key ].getAll().then( response => setItems( response.data[ key ] ) )
				}, [] )
				return [ items, setItems ]
			},
			useOne: ( id ) => {
				const [ item, setItem ] = useState( null )
				useEffect( () => {
					api[ key ].get( id ).then( response => setItem( response.data ) )
				}, [ id ] )
				return [ item, setItem ]
			}
		}

		mock.onGet( new RegExp( `/${ key }/[0-9]` ) ).reply( config => {
			const items = db[ key ]
			const id = parseInt( config.url.split( '/' ).pop() )
			const item = items.filter( item => item.id === id ).pop()
			return [ 200, item ]
		} )

		mock.onGet( new RegExp( `/${ key }/*` ) ).reply( config => {
			const args = getQueryArgs( config.url )
			let items = db[ key ]
			if ( args ) {
				items = db[ key ].filter( item => {
					for ( let arg in args ) {
						if ( item[ arg ] !== args[ arg ] ) {
							return false
						}
					}
					return true
				} )
			}
			return [ 200, {
				[ key ]: items,
			} ]
		} )

		mock.onPost( `/${ key }` ).reply( config => {
			const data = JSON.parse( config.data )
			const items = db[ key ]
			const id = items.length + 1
			const item = { ...data, id }
			db[ key ].push( item )
			updateMockupCache( cacheKey, db )
			return [ 200, item ]
		} )

		mock.onPut( new RegExp( `/${ key }/*` ) ).reply( config => {
			const data = JSON.parse( config.data )
			const items = db[ key ]
			const id = parseInt( config.url.split( '/' ).pop() )
			let updated = null
			db[ key ] = items.map( item => {
				if ( item.id === id ) {
					updated = { ...item, ...data }
					return updated
				}
				return item
			} )
			updateMockupCache( cacheKey, db )
			return [ 200, updated ]
		} )

		mock.onDelete( new RegExp( `/${ key }/*` ) ).reply( config => {
			const items = db[ key ]
			const id = parseInt( config.url.split( '/' ).pop() )
			db[ key ] = items.filter( item => item.id !== id )
			updateMockupCache( cacheKey, db )
			return [ 200, {} ]
		} )
	} )

	if ( debug ) {
		console.log( db, api ) // eslint-disable-line no-console
	}

	return api
}

const setupTables = ( tables ) => {
	Object.keys( tables ).map( key => {
		tables[ key ].map( ( row, i ) => {
			tables[ key ][ i ].id = i + 1
		} )
	} )
	return tables
}

const getMockupCache = ( key ) => {
	if ( key ) {
		return getCache( key, 'db' )
	}
	return null
}

const updateMockupCache = ( key, db ) => {
	if ( key ) {
		setCache( key, 'db', db, false )
	}
}
