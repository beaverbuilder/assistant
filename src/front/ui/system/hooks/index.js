import { createContext } from 'react'
import { createHooks } from '@wordpress/hooks'

const hooks = createHooks()

const HooksContext = createContext( hooks )
HooksContext.displayName = 'HooksContext'

export {
	hooks,
	HooksContext
}
