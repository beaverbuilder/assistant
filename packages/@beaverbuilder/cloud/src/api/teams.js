import { useEffect, useState } from 'react'

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

		useAll: () => {
			const [ teams, setTeams ] = useState( null )
			useEffect( () => {
				api.getAll().then( response => setTeams( response.data ) )
			}, [] )
			return [ teams, setTeams ]
		},

		useOne: ( id ) => {
			const [ team, setTeam ] = useState( null )
			useEffect( () => {
				if ( id ) {
					api.get( id ).then( response => setTeam( response.data ) )
				}
			}, [ id ] )
			return [ team, setTeam ]
		},
	}

	return { ...api, ...hooks }
}
