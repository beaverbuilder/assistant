export const createCachedState = ( storeKey, initialState ) => {
	const cache = localStorage.getItem( storeKey )

	if ( cache ) {
		const parsed = JSON.parse( cache )

		return { ...initialState, ...parsed }
	}

	return initialState
}

export const setupStateCaching = ( storeKey, store, cacheKeys ) => {
	if ( ! cacheKeys.length ) {
		return
	}

	store.subscribe( () => {
		const state = store.getState()
		const cache = {}

		cacheKeys.map( key => {
			cache[ key ] = state[ key ]
		} )

		localStorage.setItem( storeKey, JSON.stringify( cache ) )
	} )
}
