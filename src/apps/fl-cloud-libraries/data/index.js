import { __ } from '@wordpress/i18n'
import cloud from 'assistant/cloud'
import { getAppState, getAppActions } from 'assistant/data'

const filter = {
	owner: 'all',
	order_by: 'name',
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

export const onMount = () => {
	const { teams, libraries } = getAppState( 'fl-cloud-libraries' )
	const { setTeams, setLibraries } = getAppActions( 'fl-cloud-libraries' )

	cloud.libraries.getAll().then( response => {
		libraries[ 0 ] = response.data
		setLibraries( { ...libraries } )
	} )

	cloud.teams.getAll().then( response => {
		setTeams( response.data )
		response.data.map( team => {
			cloud.libraries.getAll( team.id ).then( response => {
				libraries[ team.id ] = response.data
				setLibraries( { ...libraries } )
			} )
		} )
	} )
}
