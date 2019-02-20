import React, { useState, useContext } from 'react'
import classname from 'classnames'
import { animated, useSpring } from 'react-spring'
import { useStore } from 'store'
import { UIContext, Stack, AppContext, Heading, Padding, Button } from 'components'
import { TunnelProvider, TunnelPlaceholder, Tunnel } from 'react-tunnels'
import './style.scss'

export const App = props => {
    const { content } = props
    const [isShowingAppMenu, setIsShowingAppMenu] = useState(false)
    const showAppMenu = () => setIsShowingAppMenu( true )
    const hideAppMenu = () => setIsShowingAppMenu( false )
    const toggleAppMenu = () => isShowingAppMenu ? hideAppMenu() : showAppMenu()

    const context = Object.assign({}, props, {
        isShowingAppMenu,
        showAppMenu,
        hideAppMenu,
        toggleAppMenu,
    })
    return (
        <AppContext.Provider value={context}>
            <TunnelProvider>
                <div className="fl-asst-app">

                    <TunnelPlaceholder id="app-menu" multiple>
                        { ({ items }) => {
                            if ( 'undefined' !== items && items.length > 0 ) {
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

const Menu = ({ title, children, displayBeside = 'full' }) => {
    const { shouldReduceMotion } = useStore()
    const { hideAppMenu, isShowingAppMenu, label } = useContext( AppContext )
    const { appFrameSize, setAppFrameSize } = useContext( UIContext )

    const toggleSize = () => {
        const sizes = ['normal', 'wide', 'full']
        const newSize = sizes[ ( sizes.indexOf( appFrameSize ) + 1 ) % sizes.length ]
        setAppFrameSize( newSize )
    }

    let shouldDisplayBesideContent = false
    if ( 'boolean' === typeof displayBeside ) {
        shouldDisplayBesideContent = displayBeside
    } else if ( 'full' === displayBeside && 'full' === appFrameSize ) {
        shouldDisplayBesideContent = true
    } else if ( 'wide' === displayBeside && ['wide', 'full'].includes( appFrameSize ) ) {
        shouldDisplayBesideContent = true
    }

    const classes = classname({
        'fl-asst-app-menu' : true,
        'fl-asst-app-menu-inline' : shouldDisplayBesideContent
    })

    const overlayProps = useSpring({
        immediate: shouldReduceMotion,
        pointerEvents: isShowingAppMenu ? 'auto' : 'none',
        opacity: isShowingAppMenu ? 1 : 0
    })
    const viewProps = useSpring({
        width: 300,
        transform: isShowingAppMenu || shouldDisplayBesideContent ? 'translateX(0%)' : 'translateX(-100%)',
        immediate: shouldReduceMotion,
    })
    const preventClickThrough = e => e.stopPropagation()

    return (
        <div className={classes}>
            { !shouldDisplayBesideContent &&
                <animated.div className="fl-asst-app-menu-overlay" style={overlayProps} onClick={hideAppMenu} />
            }
            <animated.div className="fl-asst-app-menu-contents" style={viewProps} onClick={preventClickThrough}>
                <Padding>
                    <Heading className="fl-asst-app-menu-title">{ title ? title : label }</Heading>
                </Padding>
                {children}

                <div>
                    <Button onClick={toggleSize}>Change Size</Button>
                </div>
            </animated.div>
        </div>
    )
}

export const AppMenu = props => {
    return (
        <Tunnel id="app-menu" {...props} />
    )
}
