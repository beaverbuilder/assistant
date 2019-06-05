import { registerApp, __ } from 'assistant'
import React, { Fragment } from 'fl-react'
import { useSystemState, getSystemActions } from 'assistant/store'
import { Form, ToggleControl } from 'assistant/lib'
import { AppIcon } from './app'
import './style.scss'

const App = () => {
	const { appearance, shouldShowLabels } = useSystemState()
	const { brightness } = appearance
	const { setBrightness, setShouldShowLabels } = getSystemActions()

	const edgeItems = [
		{
			children: __( 'Light' ),
			onClick: () => setBrightness( 'light' ),
			isSelected: 'light' === brightness,
		},
		{
			children: __( 'Dark' ),
			onClick: () => setBrightness( 'dark' ),
			isSelected: 'dark' === brightness
		}
	]

	return (
		<Fragment>
			<form>
				<Form.Item label={__( 'UI Brightness' )} placement="beside">
					Fix me.
				</Form.Item>
				<Form.Item label={__( 'Display Icon Labels' )} placement="beside">
					<ToggleControl
						value={shouldShowLabels}
						onChange={ v => setShouldShowLabels( v ) }
					/>
				</Form.Item>
			</form>
		</Fragment>
	)
}

registerApp( 'fl-settings', {
	label: __( 'Preferences' ),
	content: App,
	root: App,
	icon: AppIcon,
	appearance: 'form',
} )
