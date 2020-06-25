import { createContext, useContext } from 'react'

export const defaultAppContext = {
	handle: null,
    label: null,
	isAppRoot: false
}

/**
 * Context
 */
export const AppContext = createContext( defaultAppContext )

export const useAppContext = () => useContext( AppContext )
