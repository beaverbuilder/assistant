import { __ } from '@wordpress/i18n'
import cloud from 'assistant/cloud'
import { getAppState, getAppActions } from 'assistant/data'

const filter = {
	owner: 'all',
	order_by: 'name',
	order: 'ASC',
}

export const state = {
	teams: [],
	libraries: {},
	defaultFilter: filter,
	filter: filter,
	itemTypes: {
		post: {
			singular: __( 'Post' ),
			plural: __( 'Posts' ),
		},
		image: {
			singular: __( 'Image' ),
			plural: __( 'Images' ),
		},
		svg: {
			singular: __( 'SVG' ),
			plural: __( 'SVG' ),
		},
		color: {
			singular: __( 'Color' ),
			plural: __( 'Colors' ),
		},
	}
}

export const loadLibraries = () => {
	const { teams, libraries, filter } = getAppState( 'fl-cloud-libraries' )
	const { setTeams, setLibraries } = getAppActions( 'fl-cloud-libraries' )
	const { order_by, order } = filter

	const search = ( query ) => {
		query.sort( ( 'ASC' === order ? '' : '-' ) + order_by )
		return query
	}

	cloud.libraries.search( null, search ).then( response => {
		libraries[ 0 ] = response.data
		setLibraries( { ...libraries } )
	} )

	const setTeamLibraries = ( teams ) => {
		teams.map( team => {
			cloud.libraries.search( team.id, search ).then( response => {
				libraries[ team.id ] = response.data
				setLibraries( { ...libraries } )
			} )
		} )
	}

	if ( ! teams.length ) {
		cloud.teams.getAll().then( response => {
			setTeams( response.data )
			setTeamLibraries( response.data )
		} )
	} else {
		setTeamLibraries( teams )
	}
}
