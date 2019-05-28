import React from 'react'
import { __ } from '@wordpress/i18n'
import classname from 'classnames'
import { useSystemState, getSystemActions } from 'store'
import { useWindowSize } from 'utils/window'
import { Button, Icon } from 'components'
import './style.scss'

export const useAppFrame = () => {
	const { panelPosition, appFrameSize } = useSystemState()
	const { setAppFrameSize } = getSystemActions()
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
	const { isShowingUI } = useSystemState()
	const { appFrame: { width, height, alignment } } = useAppFrame()
	const { clientWidth: bodyWidth } = useWindowSize()

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

	const insideBorder = '1px solid var(--fl-line-color)'
	const insideEdge = 'end' === alignment ? 'borderLeft' : 'borderRight'
	const outsideBorder = 'none'
	const outsideEdge = 'end' === alignment ? 'borderRight' : 'borderLeft'

	const styles = {
		position: 'fixed',
		top: 0,
		width: width + 1,
		height,
		right: 'end' === alignment ? 0 : bodyWidth - width,
		transform: transform(),
		zIndex: 999999,
		boxShadow: '0px 0px 40px rgba(0, 0, 0, 0.1)',
		[insideEdge]: insideBorder,
		[outsideEdge]: outsideBorder,
	}

	const classes = classname( {
		'fl-asst-panel-frame': true,
	} )

	return (
		<nav
			className={classes}
			style={styles}
			role="navigation"
			aria-label={__( 'Assistant Panel' )}
			aria-hidden={ ! isShowingUI ? 'true' : 'false' }
		>{children}</nav>
	)
}

export const FrameSizeButton = () => {
	const { appFrameSize } = useSystemState()
	const { setAppFrameSize } = getSystemActions()

	const toggleSize = () => {
		const sizes = [ 'normal', 'wide', 'full' ]
		const nextSize = sizes[ ( sizes.indexOf( appFrameSize ) + 1 ) % sizes.length ]
		setAppFrameSize( nextSize )
	}

	return (
		<Button appearance="icon" onClick={toggleSize}>
			<Icon name={`expand-${appFrameSize}`} />
		</Button>
	)
}
