export const getCount = ( state, key ) => {
	return state.counts[ key ] ? state.counts[ key ] : 0
}

export const getLabels = ( state ) => {
	return state.labels
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
