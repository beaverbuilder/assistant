import React, { useContext, createContext } from 'react'
import { useAppState } from 'assistant/data'
import { useAttachments } from 'assistant/utils/wordpress'

export const MediaAppContext = createContext( {} )

export const useMediaApp = () => useContext( MediaAppContext )

export const MediaAppProvider = ( { children } ) => {
	const { query } = useAppState( 'fl-media' )
	const { items, loadItems, isFetching, hasMore } = useAttachments( query )
	const context = {
		items,
		loadItems,
		isFetching,
		hasMore,
	}

	return (
		<MediaAppContext.Provider value={ context }>
			{children}
		</MediaAppContext.Provider>
	)
}
