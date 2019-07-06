import React, { useState } from 'fl-react'
import { __ } from 'assistant'
import { Page, List, Button } from 'assistant/ui'

const defaultQuery = {
    term: '',
}

export const Main = () => {
    const [term, setTerm] = useState( defaultQuery.term )
    const hasResults = true

    return (
        <Page shouldShowHeader={false} shouldPadTop={true} shouldPadSides={false}>

            <Page.Toolbar>
                <input
                    value={term}
                    onChange={ e => setTerm( e.target.value ) }
                    placeholder={ __('Search') }
                />
                <Button>Test</Button>
            </Page.Toolbar>

            { hasResults && <Results query={{ term, }} /> }
        </Page>
    )
}

const Results = ({ query }) => {
    const itemProps = {
        shouldAlwaysShowThumbnail: true,
        thumbnailSize: 'sm',
    }

    return (
        <List items={testResultData} defaultItemProps={itemProps} />
    )
}

const testResultData = [
    {
        title: 'My Sample Post',
    },
    {
        title: 'About Us',
    }
]
