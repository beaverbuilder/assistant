import { useAll, useOne } from '../hooks'
import http from '../http'

export default {

	useAll: useAll( '/libraries' ),

	useOne: useOne( '/libraries' ),

	getAll: () => {
		return http.get( '/libraries' )
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
	}
}
