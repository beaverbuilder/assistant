import React, { Fragment } from 'react'
import { useDispatch } from 'store'
const { registerApp } = useDispatch()

const SettingsApp = () => {
	return (
		<Fragment>
            Yo.
		</Fragment>
	)
}

registerApp( 'fl-settings', {
	label: 'Settings',
	content: () => <SettingsApp />,
} )
