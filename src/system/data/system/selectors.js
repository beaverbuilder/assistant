import { Icon } from 'ui'

export const getCount = ( state, key ) => {
	return state.counts[ key ] ? state.counts[ key ] : 0
}

export const querySections = ( state, passedQuery ) => {
	const { sections } = state
	const defaultQuery = {
		type: '',
		tab: '',
	}
	const query = { ...defaultQuery, ...passedQuery }

	// Check if string or array of values matches the query value
	const matchesAny = ( oneOrMoreValues, matchValue ) => {

		if ( 'undefined' === typeof oneOrMoreValues ) {
			return false
		}

		if ( 'string' === typeof oneOrMoreValues && oneOrMoreValues !== matchValue ) {
			return false
		}

		// Handle array screen prop
		if ( Array.isArray( oneOrMoreValues ) && ! oneOrMoreValues.includes( matchValue ) ) {
			return false
		}

		return true
	}

	// Check if a registered section matches the query
	const matchesQuery = section => {
		const { type, tab, isEnabled } = section.location

		// Filter out BOOL isEnabled - functions get tested on render
		if ( 'boolean' === typeof isEnabled && ! isEnabled ) {
			return false
		}

		// Page Type - post, user, term, etc...
		if ( ! matchesAny( type, query.type ) ) {
			return false
		}

		// Page Tab
		if ( ! matchesAny( tab, query.tab ) ) {
			return false
		}

		return true
	}

	return Object.values( sections ).filter( matchesQuery )
}

export const selectApp = ( state, key ) => {
	if ( ! Object.keys( state.apps ).includes( key ) ) {
		return false
	}
	const app = state.apps[key]
	return {
		onMount: () => {},
		...app,
		handle: app.app,
		icon: app.icon ? app.icon : Icon.Placeholder,
	}
}

export const selectHomeKey = ( state ) => state.homeKey

export const selectHomeApp = ( state ) => {
	const key = selectHomeKey( state )
	return selectApp( state, key )
}

export const selectAppOrder = ( state, maxCount = null ) => {

	const order = state.appOrder.filter( ( key, i ) => {
		return (
			// Make sure there's a registered app
			Object.keys( state.apps ).includes( key ) &&

			// Make sure the app isn't hidden from lists
			false !== state.apps[key].shouldShowInAppList
		)
	} )
	// Filter max count AFTET shouldShowInAppList has already been filtered
	return order.filter( ( key , i ) => maxCount && i + 1 <= maxCount )
}
