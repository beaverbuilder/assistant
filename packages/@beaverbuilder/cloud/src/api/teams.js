import { useEffect, useState } from 'react'
import { useApiResource, useApiCollection } from '../http'

export default ( http ) => {

	const api = {

		getAll: () => {
			return http.get( '/account/teams' )
		},

		get: ( id ) => {
			return http.get( `/account/teams/${ id }` )
		},

		create: ( data ) => {
			return http.post( '/account/teams/register', data )
		},

		update: ( id, data ) => {
			return http.put( `/account/teams/${ id }`, data )
		},

		delete: ( id ) => {
			return http.delete( `/account/teams/${ id }` )
		},

		invite: ( id, email ) => {
			return http.post( `/account/teams/invite?team=${ id }`, { email } )
		},

		nameExists: ( name ) => {
			return new Promise( ( resolve, reject ) => {
				resolve( false )
			} )
		}
	}

	const hooks = {

		useAll: () => useApiCollection( {
			getter: api.getAll
		} ),

		useOne: ( id ) => useApiResource( id, {
			getter: api.get
		} ),
	}

	return { ...api, ...hooks }
}
