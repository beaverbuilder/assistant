import React, { Fragment, useState, useContext } from 'react'
import classname from 'classnames'
import { animated, useSpring } from 'react-spring'
import { useStore } from 'store'
import { UIContext, Stack, AppContext, Heading, Padding, Button, Icon } from 'components'
import { TunnelProvider, TunnelPlaceholder, Tunnel } from 'react-tunnels'
import './style.scss'

export const App = props => {
	const { content } = props
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
	return (
		<AppContext.Provider value={appContext}>
			<TunnelProvider>
				<div className="fl-asst-app">
					<TunnelPlaceholder id="app-menu" multiple>
						{ ( { items } ) => {
							if ( 'undefined' !== items && 0 < items.length ) {
								const props = items[0]
								return (
									<Menu {...props} />
								)
							}
							return null
						} }
					</TunnelPlaceholder>
					<Stack>{ content ? content() : null }</Stack>
				</div>
			</TunnelProvider>
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

const Menu = ( { title, children, displayBeside = 'full', width = 300 } ) => {
	const { shouldReduceMotion } = useStore()
	const { hideAppMenu, isShowingAppMenu, label } = useContext( AppContext )
	const { appFrameSize } = useContext( UIContext )

	let shouldDisplayBesideContent = shouldMenuDisplayBeside( displayBeside, appFrameSize )

	const classes = classname( {
		'fl-asst-app-menu': true,
		'fl-asst-app-menu-inline': shouldDisplayBesideContent
	} )

	const overlayProps = useSpring( {
		pointerEvents: isShowingAppMenu ? 'auto' : 'none',
		opacity: isShowingAppMenu ? 1 : 0,
		immediate: shouldReduceMotion,
	} )
	const viewProps = useSpring( {
		width,
		transform: isShowingAppMenu || shouldDisplayBesideContent ? 'translateX(0%)' : 'translateX(-100%)',
		immediate: shouldReduceMotion,
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
