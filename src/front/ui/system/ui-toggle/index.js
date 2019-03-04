import React, { useContext } from 'react'
import { Button, Branding, UIContext } from 'components'
import { animated, useSpring } from 'react-spring'
import './style.scss'

export const UIToggleButton = () => {
	const { isShowingUI, setIsShowingUI, panelPosition } = useContext( UIContext )

	const divProps = useSpring( {
		transform: isShowingUI ? 'scale(0)' : 'scale(1)'
	} )

	const styles = {
		position: 'fixed',
		right: 'end' === panelPosition ? 0 : 'auto',
		left: 'start' === panelPosition ? 0 : 'auto',
		bottom: 0,
		padding: 15,
		zIndex: 999,
		transformOrigin: 'start' === panelPosition ? 'bottom left' : 'bottom right',
		...divProps,
	}
	const buttonStyles = {
		margin: 0,
		borderRadius: '8px',
		border: 'none',
	}
	return (
		<animated.div style={styles}>
			<Button
				id="fl-asst-trigger"
				onClick={ () => setIsShowingUI( true ) } style={buttonStyles} isSelected={true}
				aria-label="Assistant Panel"
				aria-expanded={ isShowingUI ? 'false' : 'true' }
			>
				<Branding />
			</Button>
		</animated.div>
	)
}
