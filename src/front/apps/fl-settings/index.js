import React, { Fragment } from 'react'
import { __ } from '@wordpress/i18n'
import { useSystemState, getSystemActions } from 'store'
import { SettingsItem, SettingsGroup, Button, ToggleControl, Title } from 'components'
const { registerApp } = getSystemActions()
import './style.scss'

const App = () => {
	const { shouldReduceMotion, panelPosition } = useSystemState()
	const { setShouldReduceMotion, setPanelPosition } = getSystemActions()

	const nextPanelPosition = ( 'start' === panelPosition ) ? 'end' : 'start'

	return (
		<Fragment>
			<Title>{__( 'Preferences' )}</Title>

			<SettingsGroup>
				<SettingsItem label={__( 'Reduce Motion' )}>
					<ToggleControl
						value={shouldReduceMotion}
						onChange={ value => setShouldReduceMotion( value ) }
					/>
				</SettingsItem>
				<SettingsItem label={__( 'Panel Position' )}>
					<Button onClick={ () => setPanelPosition( nextPanelPosition )}>
						{ 'start' === panelPosition ? __( 'Left Edge' ) : __( 'Right Edge' ) }
					</Button>
				</SettingsItem>
			</SettingsGroup>
		</Fragment>
	)
}

const AppIcon = () => {
	return (
		<svg width="29px" height="24px" viewBox="0 0 29 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<g stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" fillRule="evenodd">
				<path d="M6,22 L3,22 C1.8954305,22 1,21.1045695 1,20 L1,3 C1,1.8954305 1.8954305,1 3,1 L3,1 L25,1 C26.1045695,1 27,1.8954305 27,3 L27,4 L27,7.5 L27,15.5 L27,19 L27,20 C27,21.1045695 26.1045695,22 25,22 L11,22" />
				<path d="M1,7.5 L7,7.5 M12,7.5 L27,7.5" />
				<path d="M1,15.5 L16,15.5 M21,15.5 L27,15.5" />
				<path d="M18.5,13 C17.11875,13 16,14.11875 16,15.5 C16,16.88125 17.11875,18 18.5,18 C19.88125,18 21,16.88125 21,15.5 C21,14.11875 19.88125,13 18.5,13 Z" transform="translate(18.500000, 15.500000) rotate(-90.000000) translate(-18.500000, -15.500000) " />
				<path d="M9.5,5 C8.11875,5 7,6.11875 7,7.5 C7,8.88125 8.11875,10 9.5,10 C10.88125,10 12,8.88125 12,7.5 C12,6.11875 10.88125,5 9.5,5 Z" transform="translate(9.500000, 7.500000) rotate(-90.000000) translate(-9.500000, -7.500000) " />
			</g>
		</svg>
	)
}

registerApp( 'fl-settings', {
	label: __( 'Preferences' ),
	content: <App />,
	icon: <AppIcon />,
} )
