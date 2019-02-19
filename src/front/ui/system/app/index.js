import React from 'react'
import { Stack, AppContext } from 'components'

export const App = props => {
    const { children, content } = props
    return (
        <AppContext.Provider value={props}>
            <Stack>{ content ? content() : null }</Stack>
        </AppContext.Provider>
    )
}
