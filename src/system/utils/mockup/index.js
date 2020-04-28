import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import camelCase from 'camelcase'
import { getCache, setCache } from 'utils/cache'

export const createMockupApi = ( tables, options ) => {
	const { cacheKey } = options
	const cache = getMockupCache( cacheKey )
	const db = cache ? { ...cache } : { ...setupTables( tables ) }
	const mock = new MockAdapter( axios )
	const api = {}

	Object.keys( db ).map( key => {
		const singular = key.substring( 0, key.length - 1 )
		const methods = {
			index: camelCase( `get_${ key }` ),
			read: camelCase( `get_${ singular }` ),
			create: camelCase( `create_${ singular }` ),
			update: camelCase( `update_${ singular }` ),
			delete: camelCase( `delete_${ singular }` )
		}

		api[ methods.index ] = () => {
			return axios.get( `/${ key }` )
		}

		api[ methods.read ] = ( id ) => {
			return axios.get( `/${ singular }/${ id }` )
		}

		api[ methods.create ] = ( data ) => {
			return axios.post( `/${ singular }`, data )
		}

		api[ methods.update ] = ( id, data ) => {
			return axios.put( `/${ singular }/${ id }`, data )
		}

		api[ methods.delete ] = ( id ) => {
			return axios.delete( `/${ singular }/${ id }` )
		}

		mock.onGet( `/${ key }` ).reply( () => {
			return [ 200, {
				[ key ]: db[ key ],
			} ]
		} )

		mock.onGet( new RegExp( `/${ singular }/*` ) ).reply( config => {
			const items = db[ key ]
			const id = parseInt( config.url.split( '/' ).pop() )
			const item = items.filter( item => item.id === id ).pop()
			return [ 200, {
				[ singular ]: item,
			} ]
		} )

		mock.onPost( `/${ singular }` ).reply( config => {
			const data = JSON.parse( config.data )
			const items = db[ key ]
			const id = items.length + 1
			const item = { ...data, id }
			db[ key ].push( item )
			updateMockupCache( cacheKey, db )
			return [ 200, {
				[ singular ]: item,
			} ]
		} )

		mock.onPut( new RegExp( `/${ singular }/*` ) ).reply( config => {
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

			return [ 200, {
				[ singular ]: updated,
			} ]
		} )

		mock.onDelete( new RegExp( `/${ singular }/*` ) ).reply( config => {
			const items = db[ key ]
			const id = parseInt( config.url.split( '/' ).pop() )
			db[ key ] = items.filter( item => item.id !== id )
			updateMockupCache( cacheKey, db )
			return [ 200, {} ]
		} )
	} )

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
