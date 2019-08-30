

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
		const { type, tab } = section.location

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
