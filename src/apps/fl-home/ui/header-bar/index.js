import React from 'react'
import { __ } from '@wordpress/i18n'
import { Layout, Form, Icon, Button } from 'assistant/ui'
import { useAppState, getAppActions } from 'assistant/data'
import './style.scss'

const app = 'fl-home'

const HeaderBar = () => {
    const { keyword } = useAppState( app )
	const { setKeyword } = getAppActions( app )

    const ClearButton = () => {
        return (
            <Button
                className="fl-asst-home-search-clear"
                appearance="transparent"
                onClick={ () => setKeyword('') }
            >
                <Icon.CloseCompact />
            </Button>
        )
    }

    return (
        <div className="fl-asst-home-search-header">
            <Layout.Row className="fl-asst-button-row">
                <Form.Input
                    className="fl-asst-floating-box"
                    before={(
                        <span className="search-icon-wrapper">
                            <Icon.Search />
                        </span>
                    )}
                    value={keyword}
                    after={ keyword && <ClearButton /> }
                    placeholder={__('Search WordPress')}
                    onInput={ e => setKeyword( e.target.value ) }
                />
            </Layout.Row>
        </div>
    )
}

export default HeaderBar
