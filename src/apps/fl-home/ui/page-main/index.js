import React from 'react'
import { HeaderBar, SearchResults, Widgets, useSearchResults } from 'home/ui'
import Welcome from './welcome'
import './style.scss'

const Main = ( { baseURL } ) => {
	const { keyword, setKeyword, results, clearResults, isLoading } = useSearchResults()
	const clearSearch = () => {
		setKeyword( '' )
		clearResults()
	}

	return (
		<div id="cards">
			<HeaderBar
				keyword={ keyword }
				onClear={ clearSearch }
				onInput={ val => setKeyword( val ) }
				onSuggestionClick={ val => setKeyword( val ) }
			/>

			{ '' !== keyword && (
				<SearchResults
					items={ results }
					isLoading={ isLoading }
					keyword={ keyword }
					baseURL={ baseURL }
				/>
			) }

			{ '' === keyword && (
				<div style={ { margin: '0 auto', maxWidth: 450 } }>
					<Widgets before={ <li><Welcome /></li> } />
				</div>
			) }
		</div>
	)
}

export default Main
