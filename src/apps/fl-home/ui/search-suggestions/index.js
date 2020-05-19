import React from 'react'
import { Button, Icon } from 'assistant/ui'
import { useSystemState, getSystemActions } from 'assistant/data'
import './style.scss'

const SearchSuggestions = () => {
    const { searchHistory } = useSystemState('searchHistory')
    const { resetSearchHistory } = getSystemActions()

    const removeTerm = term => {
        resetSearchHistory( searchHistory.filter( item => item !== term ) )
    }

    return (
        <div className="fl-asst-home-search-suggestions">
        { searchHistory.map( term => (
            <span key={term} className="fl-asst-home-search-item">
                <Button>{term}</Button>
                <Button onClick={ () => removeTerm( term )}>
                    <Icon.CloseCompact />
                </Button>
            </span>
        ))}
        </div>
    )
}

export default SearchSuggestions
