import React, { Fragment } from 'react'
import { useDispatch } from 'store'
import { ScreenHeader } from 'components'
const { registerApp } = useDispatch()

const SettingsApp = () => {
	return (
		<Fragment>
			<ScreenHeader />
			Settings go here.
		</Fragment>
	)
}

registerApp( 'fl-settings', {
	label: 'Settings',
	content: () => <SettingsApp />,
} )
