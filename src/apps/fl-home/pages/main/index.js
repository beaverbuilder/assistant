import React, { useState } from 'react'
import { Page, Layout } from 'assistant/ui'
import { HeaderBar } from 'home/ui'
import { CardPage } from '../cards'
import useSearchResults from './use-search-results'
import './style.scss'

const Main = () => {
    const { keyword, setKeyword, results, hasResults, clearResults, isLoading } = useSearchResults()
    const [isSearching, setIsSearching] = useState( false )

    return (
        <Page
			id="cards"
			padX={ false }
			padY={ false }
			toolbar={ false }
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

            { isSearching && hasResults && (
                <Layout.Box>
                    Search Results.
                </Layout.Box>
            )}

            { isLoading && (
                <Layout.Loading />
            )}

            { ! hasResults && ! isLoading && (
                <>
                    <CardPage />
                    <Layout.Box padX={true} padY={false}>
                        <div className="fl-asst-floating-box dummie-card">Dummie Card</div>
                        <div className="fl-asst-floating-box dummie-card">Dummie Card</div>
                        <div className="fl-asst-floating-box dummie-card">Dummie Card</div>
                    </Layout.Box>
                </>
            )}
		</Page>
    )
}

export default Main
