import React from 'react'
import { Page, Button, Layout } from 'assistant/ui'
import { getSystemHooks, useSystemState } from 'assistant/data'

export default () => {
    console.log('render tests')

    return (
        <Page title="Tests" padX={false}>
            test page.

            <BrightnessTest />
        </Page>
    )
}

const BrightnessTest = () => {
    const { useAppearance } = getSystemHooks()
    const [appearance, setAppearance] = useAppearance()
    return (
        <Layout.Box>
            Brightness: {appearance.brightness}
            <Button
                onClick={ () => setAppearance({
                    brightness: 'light' === appearance.brightness ? 'dark' : 'light'
                })}
            >Toggle</Button>
        </Layout.Box>
    )
}
