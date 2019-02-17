import React, { Fragment } from 'react'
import { useStore, useDispatch } from 'store'
import { ScreenHeader, Button } from 'components'
const { registerApp } = useDispatch()
import './style.scss'

const SettingsApp = () => {
	const { shouldReduceMotion, panelPosition } = useStore()
	const { setShouldReduceMotion, setPanelPosition } = useDispatch()

	const nextPanelPosition = ( 'start' === panelPosition ) ? 'end' : 'start'

	return (
		<Fragment>
			<ScreenHeader />

			<div>
				<div className="fl-asst-settings-item">
					<label>Reduce Motion</label>
					<div className="fl-asst-settings-item-control">
						<Button onClick={ () => setShouldReduceMotion( ! shouldReduceMotion )}>
							{ shouldReduceMotion ? 'Disabled' : 'Enabled' }
						</Button>
					</div>
				</div>
				<div className="fl-asst-settings-item">
					<label>Position</label>
					<div className="fl-asst-settings-item-control">
						<Button onClick={ () => setPanelPosition(nextPanelPosition)}>
							{ 'start' === panelPosition ? 'Left Edge' : 'Right Edge' }
						</Button>
					</div>
				</div>
			</div>
		</Fragment>
	)
}

registerApp( 'fl-settings', {
	label: 'Settings',
	content: () => <SettingsApp />,
} )
