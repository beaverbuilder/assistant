import cloud from 'assistant/cloud'
import { getAppState, getAppActions } from 'assistant/data'

const filter = {
	owner: 'all',
	order_by: 'name',
	order: 'ASC',
	displayAs: 'grid'
}

const itemsFilter = {
	view_by: 'type',
	type: 'all',
	collection: 'all',
	order_by: 'name',
	order: 'ASC'
}

export const state = {
	teams: [],
	libraries: {},
	defaultFilter: filter,
	filter: filter,
	defaultItemsFilter: itemsFilter,
	itemsFilter: itemsFilter,

	isLoadingTeams: false,
	isLoadingLibraries: false,
}

export const loadLibraries = () => {
	const { teams, libraries, filter } = getAppState( 'fl-cloud-libraries' )
	const {
		setTeams,
		setLibraries,
		setIsLoadingTeams,
		setIsLoadingLibraries
	} = getAppActions( 'fl-cloud-libraries' )

	const { order_by, order } = filter

	const search = ( query ) => {
		query.sort( ( 'ASC' === order ? '' : '-' ) + order_by )
		return query
	}

	setIsLoadingLibraries( true )
	cloud.libraries.search( null, search ).then( response => {
		libraries[ 0 ] = response.data
		setLibraries( { ...libraries } )
		setIsLoadingLibraries( false )
	} )

	const setTeamLibraries = ( teams ) => {
		teams.map( team => {
			cloud.libraries.search( team.id, search ).then( response => {
				libraries[ team.id ] = response.data
				setLibraries( { ...libraries } )
				setIsLoadingLibraries( false )
			} )
		} )
	}

	if ( ! teams.length ) {
		setIsLoadingTeams( true )
		cloud.teams.getAll().then( response => {
			setTeams( response.data )
			setTeamLibraries( response.data )
			setIsLoadingTeams( false )
		} )
	} else {
		setTeamLibraries( teams )
	}
}
