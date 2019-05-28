import { useState } from 'react'

export const useToggle = ( initial = false ) => {
    const [value, set] = useState( initial )

    const toggle = () => {
        value ? set( false ) : set( true )
        return value
    }

    return {
        value,
        set,
        toggle,
    }
}
