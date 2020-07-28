import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Layout } from 'assistant/ui'
import cloud from 'assistant/cloud'
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
