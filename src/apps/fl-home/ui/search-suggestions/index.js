import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Icon } from 'assistant/ui'
import { useSystemState, getSystemActions, getAppActions } from 'assistant/data'
import './style.scss'

const app = 'fl-home'

const SearchSuggestions = ({ onClick = () => {} }) => {
    const { searchHistory } = useSystemState('searchHistory')
    const { resetSearchHistory } = getSystemActions()

    const removeTerm = term => {
        resetSearchHistory( searchHistory.filter( item => item !== term ) )
    }

    return (
        <div className="fl-asst-home-search-suggestions">
            <div style={{ marginBottom: 10 }}>{__('Recent Searches')}</div>
            <div>
            { searchHistory.map( term => (
                <span key={term} className="fl-asst-home-search-item">
                    <Button onClick={ () => onClick( term )}>{term}</Button>
                    <Button onClick={ () => removeTerm( term )}>
                        <Icon.CloseCompact />
                    </Button>
                </span>
            ))}
            </div>
        </div>
    )
}

export default SearchSuggestions
