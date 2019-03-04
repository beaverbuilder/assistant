import React, { useContext } from 'react'
import { animated, useSpring } from 'react-spring'
import { Button, Branding, UIContext } from 'components'
import { useSystemState } from 'store'
import './style.scss'

export const UIToggleButton = () => {
	const { isShowingUI, setIsShowingUI, panelPosition } = useContext( UIContext )
	const { shouldReduceMotion } = useSystemState()

	const divProps = useSpring( {
		transform: isShowingUI ? 'scale(0)' : 'scale(1)',
		immediate: shouldReduceMotion,
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
	return (
		<animated.div style={styles}>
			<Button
				id="fl-asst-trigger"
				onClick={ () => setIsShowingUI( true ) }
				isSelected={true}
				aria-label="Assistant Panel"
				aria-expanded={ isShowingUI ? 'false' : 'true' }
			>
				<Branding />
			</Button>
		</animated.div>
	)
}
