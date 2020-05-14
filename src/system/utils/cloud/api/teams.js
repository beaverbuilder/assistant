import { __ } from '@wordpress/i18n'
import { createSlug } from 'utils/url'
import { useAll, useOne } from '../hooks'
import mockup from '../mockup'
import http from '../http'

export default {
	...mockup.teams,

	useAll: useAll( '/account/teams' ),

	useOne: useOne( '/account/teams' ),

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
