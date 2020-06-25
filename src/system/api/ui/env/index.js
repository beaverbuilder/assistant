import React, { createContext, useContext } from 'react'
import { useMedia } from 'utils/react'

const Env = {}

Env.defaults = {
	application: 'standalone',
	isMobile: false,
	isCompactHeight: false,
}

const EnvContext = createContext( Env.defaults )

Env.Provider = ( { application = 'standalone', ...rest } ) => {
	const isMobile = useMedia( { maxWidth: '450px' } )
	const isCompactHeight = useMedia( { maxHeight: '475px' } )
	return (
		<EnvContext.Provider
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

Env.use = () => useContext( EnvContext )

export default Env
