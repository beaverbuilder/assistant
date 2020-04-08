import React, { createContext, useContext } from 'react'
import { useMedia } from 'utils/react'

const Env = {}

Env.defaults = {
	application: 'standalone',
	isMobile: false,
	isCompactHeight: false,
}

Env.Context = createContext( Env.defaults )
Env.Context.displayName = 'Env.Context'

Env.Provider = ( { application = 'standalone', ...rest } ) => {
	const isMobile = useMedia( { maxWidth: '450px' } )
	const isCompactHeight = useMedia( { maxHeight: '475px' } )
	return (
		<Env.Context.Provider
			value={ {
				...Env.defaults,
				application,
				isMobile,
				isCompactHeight
			} }
			{ ...rest }
		/>
	)
}

Env.useEnvironment = () => {
	return useContext( Env.Context )
}

export default Env
