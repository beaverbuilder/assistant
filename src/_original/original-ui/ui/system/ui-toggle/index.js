import React, { useContext } from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Branding, UIContext } from 'components'
import './style.scss'

export const UIToggleButton = () => {
	const { isShowingUI, setIsShowingUI, panelPosition } = useContext( UIContext )

	const styles = {
		position: 'fixed',
		right: 'end' === panelPosition ? 0 : 'auto',
		left: 'start' === panelPosition ? 0 : 'auto',
		bottom: 0,
		padding: 15,
		zIndex: 999,
		transformOrigin: 'start' === panelPosition ? 'bottom left' : 'bottom right',
	}
	return (
		<div style={ styles }>
			<Button
				id="fl-asst-trigger"
				onClick={ () => setIsShowingUI( true ) }
				isSelected={ true }
				aria-label={ __( 'Assistant Panel' ) }
				aria-expanded={ isShowingUI ? 'false' : 'true' }
			>
				<Branding />
			</Button>
		</div>
	)
}
