import { useEffect, useState } from 'react'
import { __ } from '@wordpress/i18n'
import { createSlug } from 'utils/url'
import mockup from './mockup'
import http from './http'

export default {
	...mockup.teams,

	useAll: () => {
		const [ teams, setTeams ] = useState( null )
		useEffect( () => {
			http.get( '/account/teams' ).then( response => {
				setTeams( response.data )
			} )
		}, [] )
		return [ teams, setTeams ]
	},

	useOne: ( id ) => {
		const [ team, setTeam ] = useState( null )
		useEffect( () => {
			http.get( `/account/teams/${ id }` ).then( response => {
				setTeam( response.data )
			} )
		}, [ id ] )
		return [ team, setTeam ]
	},

	getAll: () => {
		return http.get( '/account/teams' )
	},

	get: ( id ) => {
		return http.get( `/account/teams/${ id }` )
	},

	create: ( data ) => {
		return http.post( '/account/teams/register', data )
	},

	// create: ( data ) => {
	// 	return new Promise( ( resolve, reject ) => {
	// 		const teams = mockup.teams.getData().filter(
	// 			team => createSlug( team.name ) === createSlug( data.name )
	// 		)
	//
	// 		if ( teams.length ) {
	// 			reject( {
	// 				errors: {
	// 					name: __( 'That name already exists.' )
	// 				}
	// 			} )
	// 			return
	// 		}
	//
	// 		mockup.teams.create( data ).then( response => resolve( response ) )
	// 	} )
	// },

	nameExists: ( name ) => {
		return mockup.teams.getAll( { name } ).then( response => {
			return !! response.data.teams.length
		} )
	}
}
