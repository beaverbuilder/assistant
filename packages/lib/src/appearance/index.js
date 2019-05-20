import React, { createContext, useState } from 'react'

const defaults = {
    brightness: 'light',
    contrast: 'normal',
    color: 'normal',
}

export const AppearanceContext = createContext( defaults )
AppearanceContext.displayName = 'AppearanceContext'

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
