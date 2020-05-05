import React, { useEffect } from 'react'
import { App } from 'assistant/ui'
import { Main, Library } from './pages'
import { getLibrariesActions } from './data'
import cloud from 'assistant/utils/cloud'

export default props => {

    return (
        <App.Config
            pages={{
                default: Main,
                'library/:id': Library
            }}
            {...props}
        />
    )
}
