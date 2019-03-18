import React, { Fragment, useState, useContext, useEffect } from 'react'
import classname from 'classnames'
import { animated, useSpring, config } from 'react-spring'
import {
	useSystemState,
	getSystemActions,
	getSystemConfig,
	useAppState,
	getAppActions,
} from 'store'

import { useAppFrame } from 'system'
import { render } from 'utils/react'
import {
	UIContext,
	Stack,
	AppContext,
	Heading,
	Padding,
	Button,
	Icon,
	EmptyMessage,
	Branding
} from 'components'
import { TunnelPlaceholder, Tunnel } from 'react-tunnels'
import './style.scss'

export const App = props => {
	const { content } = props
	const { appFrame: { width } } = useAppFrame()
	const { isDocumentLoaded } = useDocumentReadyState()

	// App menu API
	const [ isShowingAppMenu, setIsShowingAppMenu ] = useState( false )
	const showAppMenu = () => setIsShowingAppMenu( true )
	const hideAppMenu = () => setIsShowingAppMenu( false )
	const toggleAppMenu = () => isShowingAppMenu ? hideAppMenu() : showAppMenu()

	const appContext = Object.assign( {}, props, {
		isShowingAppMenu,
		showAppMenu,
		hideAppMenu,
		toggleAppMenu,
	} )

	const styles = {
		width,
		alignSelf: 'center'
	}

	const output = render( content, props )

	if ( ! output ) {
		if ( isDocumentLoaded ) {
			return (
				<AppNotFoundScreen />
			)
		} else {
			return null
		}
	}

	return (
		<AppContext.Provider value={appContext}>
			<div className="fl-asst-app" style={styles}>
				<AppContentWrapper>
					<AppMenuRenderer />
					<Stack>{ output }</Stack>
				</AppContentWrapper>
			</div>
		</AppContext.Provider>
	)
}

const shouldMenuDisplayBeside = ( displayBeside, appFrameSize ) => {
	if ( 'boolean' === typeof displayBeside ) {
		return displayBeside
	} else if ( 'full' === displayBeside && 'full' === appFrameSize ) {
		return true
	} else if ( 'wide' === displayBeside && [ 'wide', 'full' ].includes( appFrameSize ) ) {
		return true
	}
	return false
}

const Menu = ( { title, children, displayBeside = 'full', width = 260 } ) => {
	const { shouldReduceMotion } = useSystemState()
	const { hideAppMenu, isShowingAppMenu, label } = useContext( AppContext )
	const { appFrameSize } = useContext( UIContext )

	let shouldDisplayBesideContent = shouldMenuDisplayBeside( displayBeside, appFrameSize )

	const classes = classname( {
		'fl-asst-app-menu': true,
		'fl-asst-app-menu-inline': shouldDisplayBesideContent
	} )

	const springConfig = { ...config.default, tension: 400, friction: 33 }

	const overlayProps = useSpring( {
		pointerEvents: isShowingAppMenu ? 'auto' : 'none',
		opacity: isShowingAppMenu ? 1 : 0,
		immediate: shouldReduceMotion,
		config: springConfig,
	} )
	const viewProps = useSpring( {
		width,
		transform: isShowingAppMenu || shouldDisplayBesideContent ? 'translateX(0%)' : 'translateX(-100%)',
		boxShadow: ! isShowingAppMenu ? 'none' : '',
		immediate: shouldReduceMotion,
		config: springConfig,
	} )
	const preventClickThrough = e => e.stopPropagation()

	return (
		<div className={classes}>
			{ ! shouldDisplayBesideContent &&
                <animated.div className="fl-asst-app-menu-overlay" style={overlayProps} onClick={hideAppMenu} />
			}
			<animated.div className="fl-asst-app-menu-panel" style={viewProps} onClick={preventClickThrough}>
				<Stack>
					{ false !== title && <AppMenuHeader title={ title ? title : label } /> }
					<div className="fl-asst-app-menu-contents">{children}</div>
				</Stack>
			</animated.div>
		</div>
	)
}

const AppMenuRenderer = () => {
	return (
		<TunnelPlaceholder id="app-menu" multiple>
			{ ( { items } ) => {
				if ( 'undefined' !== items && 0 < items.length ) {
					const props = items[0]
					return <Menu {...props} />
				}
				return null
			} }
		</TunnelPlaceholder>
	)
}

const AppMenuHeader = ( { title } ) => {
	return (
		<Fragment>
			<Padding>
				<Heading className="fl-asst-app-menu-title">{title}</Heading>
			</Padding>
		</Fragment>
	)
}

export const AppMenu = props => {
	return (
		<Tunnel id="app-menu" {...props} />
	)
}

export const AppMenuButton = () => {
	const { toggleAppMenu } = useContext( AppContext )
	const { appFrameSize } = useContext( UIContext )
	return (
		<TunnelPlaceholder id="app-menu" multiple>
			{ ( { items } ) => {
				if ( items && 0 < items.length ) {
					const { displayBeside = 'full', children } = items[0]

					if ( ! children ) {
						return null
					}

					if ( shouldMenuDisplayBeside( displayBeside, appFrameSize ) ) {
						return null
					}

					return (
						<Button onClick={toggleAppMenu} appearance="icon">
							<Icon name="menu" />
						</Button>
					)
				}
				return null
			} }
		</TunnelPlaceholder>
	)
}

const AppNotFoundScreen = () => {
	return (
		<EmptyMessage>
			<Padding>
				<Branding name="outline" />
			</Padding>
			Oops, we could not find your app!
		</EmptyMessage>
	)
}

const AppContentWrapper = ( { children } ) => {
	const { isAppHeaderExpanded } = useAppState()
	const { setIsAppHeaderExpanded } = getAppActions()

	const classes = classname( {
		'fl-asst-app-content': true,
		'fl-asst-app-content-is-dimmed': isAppHeaderExpanded
	} )

	return (
		<div
			className={classes}
			onClick={ () => {
				if ( isAppHeaderExpanded ) {
					setIsAppHeaderExpanded( false )
				}
			}}
		>{children}</div>
	)
}

export const useActiveApp = () => {
	const { apps, activeApp: name, appOrder } = useSystemState()
	const { defaultAppName } = getSystemConfig()
	const { state, isDocumentLoaded } = useDocumentReadyState()
	const { setActiveApp } = getSystemActions()

	useEffect( () => {
		if ( isDocumentLoaded && 'undefined' === typeof apps[ name ] ) {
			if ( Object.keys( apps ).includes( defaultAppName ) ) {
				setActiveApp( defaultAppName )
			} else {
				const key = appOrder[0]
				setActiveApp( key )
			}
		}
	}, [ state ] )

	return {
		key: name,
		app: apps[ name ],
		setActiveApp,
		apps,
		activeAppName: name,
		activeApp: apps[ name ],
	}
}

export const useDocumentReadyState = () => {
	const [ state, setState ] = useState( document.readyState )
	const eventChanged = e => setState( e.target.readyState )

	useEffect( () => {
		document.addEventListener( 'readystatechange', eventChanged )
		return () => document.removeEventListener( 'readystatechange', eventChanged )
	} )

	return {
		isDocumentLoaded: 'complete' === state,
		isDocumentLoading: 'loaded' === state || 'interactive' === state,
		state,
	}
}
