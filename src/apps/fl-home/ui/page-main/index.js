import React, { useState } from 'react'
import { Page } from 'assistant/ui'
import { HeaderBar, SearchResults, Widgets, useSearchResults } from 'home/ui'
import './style.scss'

const noop = () => {}

const Main = () => {
    const { keyword, setKeyword, results, hasResults, clearResults, isLoading } = useSearchResults()
    const [isSearching, setIsSearching] = useState( false )

    console.log('main')

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
                onFocus={ () => setIsSearching( true ) }
                onClear={ () => {
                    setIsSearching( false )
                    setKeyword( '' )
                    clearResults()
                } }
                onInput={ val => setKeyword( val ) }
                onSuggestionClick={ val => setKeyword( val ) }
            />

            { isSearching && ( hasResults || isLoading ) && (
                <SearchResults items={results} isLoading={isLoading} />
            ) }

            { ! hasResults && ! isLoading && <Widgets /> }
		</Page>
    )
}

export default Main
