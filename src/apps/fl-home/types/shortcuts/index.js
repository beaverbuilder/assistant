import React from 'react'
import { Button, Icon, Env } from 'assistant/ui'
import { getSystemConfig, useSystemState, getSystemActions } from 'assistant/data'
import { Dashicon } from '@wordpress/components'

const Shortcuts = () => {
	const { application } = Env.use()
	const { adminURLs } = getSystemConfig()
	const dashURL = 'undefined' !== typeof adminURLs.dashboard ? adminURLs.dashboard : '/wp-admin'

	const { appearance } = useSystemState()
	const { setBrightness } = getSystemActions()
	const toggleBrightness = () => 'light' === appearance.brightness ? setBrightness( 'dark' ) : setBrightness( 'light' )

	const items = [
		{
			icon: <Dashicon icon="wordpress" />,
			href: dashURL,
			shouldDisplay: true,
		},
		{
			icon: 'light' === appearance.brightness ? <Icon.Moon /> : <Icon.Brightness />,
			onClick: toggleBrightness,
			shouldDisplay: 'beaver-builder' !== application
		}
	]

	return items.map( ( item, i ) => {
		const { icon, shouldDisplay, ...rest } = item
		return shouldDisplay && (
			<Button key={ i } appearance="transparent" { ...rest }>
				{icon}
			</Button>
		)
	} )
}

Shortcuts.Edit = () => {
	return (
		<div>Edit Shortcuts</div>
	)
}

export default Shortcuts
