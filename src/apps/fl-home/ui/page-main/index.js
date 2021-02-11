import React from 'react'
import { Page } from 'assistant/ui'
import { HeaderBar, SearchResults, Widgets, useSearchResults } from 'home/ui'
import Welcome from './welcome'
import './style.scss'

const noop = () => {}

const Main = ( { baseURL } ) => {
	const { keyword, setKeyword, results, clearResults, isLoading } = useSearchResults()
	const clearSearch = () => {
		setKeyword( '' )
		clearResults()
	}

	return (
		<Page
			id="cards"
			padX={ false }
			padY={ false }
			toolbar={ false }
			onLoad={ noop }
		>
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
		</Page>
	)
}

export default Main
