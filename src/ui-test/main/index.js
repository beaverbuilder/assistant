import React, { useState } from 'react'
import {
    Window,
    useAppearance,
    useToggle
} from 'lib'
import { Flipper } from 'react-flip-toolkit'

export const Main = () => {
    const [needsAnimate, setNeedsAnimate] = useState(0)
    const { value: isHidden, toggle } = useToggle( false )

    // Appearance
    const { appearance, AppearanceContext, toggleBrightness } = useAppearance({
        brightness: 'dark',
    })

    // Animation
    const shouldAnimate = true
    const requestAnimate = () => {
        if ( shouldAnimate ) {
            setNeedsAnimate( needsAnimate + 1 )
        }
    }

    const tempBoxStyles = {
        background: '#FF5A5E',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        flex: '1 1 auto',
        width: 'calc( 100% - 30px )',
        height: 300,
        margin: 15,
    }

    return (
        <Flipper flipKey={needsAnimate}>
            <AppearanceContext.Provider value={appearance}>
                <Window requestAnimate={requestAnimate}>

                    <div style={tempBoxStyles}>Apps Go Here!</div>

                </Window>
            </AppearanceContext.Provider>
        </Flipper>
    )
}
