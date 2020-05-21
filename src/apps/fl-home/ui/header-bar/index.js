import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Layout, Form, Icon, Button } from 'assistant/ui'
import SearchSuggestions from './search-suggestions'
import './style.scss'

const noop = () => {}

const HeaderBar = ({
    onFocus = noop,
    onClear = noop,
    onInput = noop,
    onSuggestionClick = noop,
    keyword = '',
}) => {
    const [isFocused, setIsFocused] = useState( false )

    const SearchIcon = () => (
        <span className="search-icon-wrapper">
            <Icon.Search />
        </span>
    )

    const Back = () => {
        return (
            <Button
                appearance="transparent"
                className="fl-asst-home-search-clear"
                onClick={ e => {
                    setIsFocused( false )
                    onClear()
                } }
            >
                <Icon.BackArrow />
            </Button>
        )
    }

    return (
        <>
            <div className="fl-asst-home-search-header fluid-sticky-element" >
                <Layout.Row className="fl-asst-button-row">
                    <Form.Input
                        className="fl-asst-floating-element"
                        before={ '' !== keyword ? <Back /> : <SearchIcon /> }
                        value={keyword}
                        placeholder={ __('Search WordPress') }
                        onInput={ e => {
                            onInput( e.target.value )
                            if ( '' === e.target.value ) {
                                onClear()
                            }
                        } }
                        onFocus={ () => {
                            setIsFocused( true )
                            onFocus()
                        } }
                    />
                </Layout.Row>
            </div>
            { ( '' !== keyword || isFocused ) && <SearchSuggestions onClick={onSuggestionClick}/> }
        </>
    )
}

export default HeaderBar
