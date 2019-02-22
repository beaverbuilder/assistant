import React from 'react'
import { useSpring, animated } from 'react-spring'
import { useStore, getDispatch, useAppState } from 'store'
import { useWindowSize } from 'utils/window'
import { Button, Icon } from 'components'

export const useAppFrame = () => {
	const { panelPosition, appFrameSize } = useStore()
	const { setAppFrameSize } = getDispatch()
	const { width: windowWidth } = useWindowSize()

	const normalPreferredWidth = 460
	const widePreferredWidth = 768
	const threshold = .8
	let frameWidth = 0
	let frameHeight = '100vh'
	let isDisplayingFullscreen = false

	if ( 'wide' === appFrameSize ) {
		if ( widePreferredWidth > ( windowWidth * threshold ) ) {
			frameWidth = windowWidth
			isDisplayingFullscreen = true
		} else {
			frameWidth = widePreferredWidth
		}
	} else if ( 'full' === appFrameSize ) {
		frameWidth = windowWidth
		isDisplayingFullscreen = true
	} else {
		if ( normalPreferredWidth > ( windowWidth * threshold ) ) {
			frameWidth = windowWidth
			isDisplayingFullscreen = true
		} else {
			frameWidth = normalPreferredWidth
		}
	}

	return {
		appFrame: {
			width: frameWidth,
			height: frameHeight,
			sizeName: appFrameSize,
			alignment: panelPosition,
			isDisplayingFullscreen,
		},
		setAppFrameSize,
	}
}

export const AppFrame = ( { children } ) => {
	const { isShowingUI, shouldReduceMotion } = useStore()
	const { appFrame: { width, height, alignment } } = useAppFrame()
	const { width: windowWidth } = useWindowSize()

	const transform = () => {
		if ( isShowingUI ) {
			return 'translateX( 0% )'
		} else {
			if ( 'end' === alignment ) {
				return 'translateX( 100% )'
			} else {
				return 'translateX( -100% )'
			}
		}
	}

	const springProps = useSpring( {
		width: width + 1/* account for inside edge border */,
		height,
		right: 'end' === alignment ? 0 : windowWidth - width,
		transform: transform(),
		immediate: shouldReduceMotion,
	} )

	const insideBorder = '1px solid var(--fl-line-color)'
	const insideEdge = 'end' === alignment ? 'borderLeft' : 'borderRight'
	const outsideBorder = 'none'
	const outsideEdge = 'end' === alignment ? 'borderRight' : 'borderLeft'

	const styles = {
		position: 'fixed',
		top: 0,
		zIndex: 999999,
		boxShadow: '0px 0px 40px rgba(0, 0, 0, 0.1)',
		[insideEdge]: insideBorder,
		[outsideEdge]: outsideBorder,
		...springProps
	}

	return (
		<animated.div style={styles}>{children}</animated.div>
	)
}

export const FrameSizeButton = () => {
	const { appFrameSize, apps, activeApp: handle } = useStore()
	const [size, setSize] = useAppState('size')
	const { setAppFrameSize } = getDispatch()
	const app = apps[handle]

	if ( app.supportsSizes.length < 2 ) {
		return null
	}

	const toggleSize = () => {
		const sizes = app.supportsSizes
		const nextSize = sizes[ ( sizes.indexOf( appFrameSize ) + 1 ) % sizes.length ]
		setAppFrameSize( nextSize )
		setSize( nextSize )
	}

	return (
		<Button appearance="icon" onClick={toggleSize}>
			<Icon />
		</Button>
	)
}
