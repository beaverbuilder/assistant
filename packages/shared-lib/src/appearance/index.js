import React, { createContext, useState } from 'fl-react'
import classname from 'classnames'
import './style.scss'

const defaults = {
    brightness: 'light',
    contrast: 'normal',
    color: 'normal',
}

export const AppearanceContext = createContext( defaults )
AppearanceContext.displayName = 'AppearanceContext'

export const Appearance = ({ className, brightness = 'light', ...rest }) => {

    const classes = classname({
        'fl-asst-appearance' : true,
        [`fl-asst-brightness-${brightness}`] : brightness,
    }, className )

    const context = {
        brightness,
    }
    return (
        <AppearanceContext.Provider value={context}>
            <div className={classes} {...rest} />
        </AppearanceContext.Provider>
    )
}

export const useAppearance = ( options = defaults ) => {
    const [appearance, setAppearance] = useState({ ...defaults, ...options })

    const setAttribute = ( key = '', value = '' ) => {
        if ( key in defaults ) {
            setAppearance({
                ...appearance,
                [key] : value,
            })
        }
        return false
    }

    const toggleBrightness = () => {
        const attr = 'brightness'
        if ( 'light' === appearance.brightness ) {
            setAttribute( attr, 'dark' )
        } else {
            setAttribute( attr, 'light' )
        }
    }

    return {
        set: options => setAppearance({ ...appearance, ...options }),
        setAttribute,
        AppearanceContext,
        appearance,
        toggleBrightness,
    }
}
