import React, { useState, useContext } from 'react'
import { animated, useSpring } from 'react-spring'
import { useStore } from 'store'
import { Stack, AppContext, Heading, Padding } from 'components'
import { TunnelProvider, TunnelPlaceholder, Tunnel } from 'react-tunnels'
import './style.scss'

export const App = props => {
	const { content } = props
	const [ isShowingAppMenu, setIsShowingAppMenu ] = useState( false )
	const showAppMenu = () => setIsShowingAppMenu( true )
	const hideAppMenu = () => setIsShowingAppMenu( false )
	const toggleAppMenu = () => isShowingAppMenu ? hideAppMenu() : showAppMenu()

	const hasMenuContent = true

	const context = Object.assign( {}, props, {
		isShowingAppMenu,
		showAppMenu,
		hideAppMenu,
		toggleAppMenu,
		hasMenuContent,
	} )
	return (
		<AppContext.Provider value={context}>
			<TunnelProvider>
				<div className="fl-asst-app">

					<TunnelPlaceholder id="app-menu" multiple>
						{ ( { items } ) => {
							if ( 'undefined' !== items && 0 < items.length ) {
								const { title, children } = items[0]
								return (
									<Menu title={title}>{children}</Menu>
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

const Menu = ( { title, children } ) => {
	const { shouldReduceMotion } = useStore()
	const { hideAppMenu, isShowingAppMenu, label } = useContext( AppContext )

	const overlayProps = useSpring( {
		immediate: shouldReduceMotion,
		pointerEvents: isShowingAppMenu ? 'auto' : 'none',
		opacity: isShowingAppMenu ? 1 : 0
	} )
	const viewProps = useSpring( {
		width: 300,
		transform: isShowingAppMenu ? 'translateX(0%)' : 'translateX(-100%)',
		immediate: shouldReduceMotion,
	} )
	const preventClickThrough = e => e.stopPropagation()
	return (
		<div className="fl-asst-app-menu">
			<animated.div className="fl-asst-app-menu-overlay" style={overlayProps} onClick={hideAppMenu} />
			<animated.div className="fl-asst-app-menu-contents" style={viewProps} onClick={preventClickThrough}>
				<Padding>
					<Heading className="fl-asst-app-menu-title">{ title ? title : label }</Heading>
				</Padding>
				{children}
			</animated.div>
		</div>
	)
}

export const AppMenu = ( { children, title } ) => {
	return (
		<Tunnel id="app-menu" title={title}>{children}</Tunnel>
	)
}
