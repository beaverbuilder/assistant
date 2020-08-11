import React, { useState } from 'react'
import './style.scss'

import Search from './search'
import SearchResults from './search-results'

export default () => {
	const [ results, setResults ] = useState( null )

	return (
		<>
			<Search onChange={ value => setResults( value ) } />
			<SearchResults results={ results } />
		</>
	)
}
