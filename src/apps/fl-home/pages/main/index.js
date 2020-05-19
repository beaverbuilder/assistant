import React, { useState } from 'react'
import { Page, Layout, Icon } from 'assistant/ui'
import { HeaderBar, Results } from 'home/ui'
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
                <Results items={results} />
            )}

            { isLoading && (
                <Layout.Loading />
            )}

            { ! hasResults && ! isLoading && (
                <>
                    <CardPage />
                    <Layout.Row padY={true}>
                        <Icon.Pencil />
                    </Layout.Row>
                </>
            )}
		</Page>
    )
}

export default Main
