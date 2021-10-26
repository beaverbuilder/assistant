import React from 'react'
import { HeaderBar, SearchResults, Widgets, useSearchResults } from '../'
import Welcome from './welcome'
import HomeSections from '../sections'
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
				<>
					{ false && <Welcome /> }
					<HomeSections />

					{ false && (
						<div style={ { margin: '0 auto', maxWidth: 450 } }>
							<Widgets />
						</div>
					) }
				</>
			) }
		</div>
	)
}

export default Main
