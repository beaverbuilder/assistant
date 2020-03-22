import React, { createContext, useContext } from 'react'
import { useMedia } from 'utils/react'

const Env = {}

Env.defaults = {
	application: 'standalone',
	isMobile: false,
}

Env.Context = createContext( Env.defaults )
Env.Context.displayName = 'Env.Context'

Env.Provider = ( { application = 'standalone', ...rest } ) => {
	const isMobile = useMedia( { maxWidth: '450px' } )
	return (
		<Env.Context.Provider
			value={ {
				...Env.defaults,
				application,
				isMobile,
			} }
			{ ...rest }
		/>
	)
}

Env.useEnvironment = () => {
	return useContext( Env.Context )
}

export default Env
