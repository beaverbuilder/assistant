import React from 'react'
import { Page, App } from 'assistant/ui'

export default () => {
    return (
        <App.Config
            pages={{
                default: Main
            }}
        />
    )
}

const Main = () => {
    return (
        <Page title="Libraries" toolbar={false}>
            <h1>Libraries</h1>
        </Page>
    )
}
