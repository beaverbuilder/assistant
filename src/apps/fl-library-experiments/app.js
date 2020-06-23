import React from 'react'
import { Main } from './ui'
import { App } from 'assistant/ui'

const ExperimentsApp = props => {
    return (
        <App.Config
            pages={{
                default: Main
            }}
            { ...props }
        />
    )
}

export default ExperimentsApp
