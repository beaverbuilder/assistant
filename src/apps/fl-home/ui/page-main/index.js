import React from 'react'
import { Page } from 'assistant/ui'
import { HeaderBar, SearchResults, Widgets, useSearchResults } from 'home/ui'
import './style.scss'

const noop = () => {}

const Main = ({ baseURL }) => {
    const { keyword, setKeyword, results, hasResults, clearResults, isLoading } = useSearchResults()

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
                onClear={ () => {
                    setKeyword( '' )
                    clearResults()
                } }
                onInput={ val => setKeyword( val ) }
                onSuggestionClick={ val => setKeyword( val ) }
            />

            { '' !== keyword && ( hasResults || isLoading ) && (
                <SearchResults
                    items={results}
                    isLoading={isLoading}
                    keyword={keyword}
                    baseURL={baseURL}
                />
            ) }

            { ! hasResults && ! isLoading && <Widgets /> }
		</Page>
    )
}

export default Main
