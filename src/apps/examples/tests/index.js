import React from 'react'
import { Page, Button, Layout } from 'assistant/ui'
import { getSystemHooks, getSystemActions } from 'assistant/data'

export default () => {
	return (
		<Page title="Tests" padX={ false }>
			<Layout.Box>
                Just a spot for some tests.
			</Layout.Box>

			<BrightnessTest />
		</Page>
	)
}

const BrightnessTest = () => {
	const { useAppearance } = getSystemHooks()
	const { setBrightness } = getSystemActions()
	const [ appearance ] = useAppearance()
	return (
		<Layout.Box>
            Brightness: {appearance.brightness}
			<Button
				onClick={ () => setBrightness( 'light' === appearance.brightness ? 'dark' : 'light' ) }
			>Toggle</Button>
		</Layout.Box>
	)
}
