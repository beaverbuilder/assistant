export const registerApp = ( key, config ) => {
	return {
		type: 'REGISTER_APP',
		key,
		config,
	}
}

export const setAppPosition = ( key, position ) => {
	return {
		type: 'SET_APP_POSITION',
		key,
		position,
	}
}

export const resetAppOrder = ( keys = [], persist = false ) => {
	return {
		type: 'RESET_APP_ORDER',
		keys,
		persist
	}
}

export const setAppOrder = ( keys = [], persist = false ) => {
	return {
		type: 'SET_APP_ORDER',
		keys,
		persist
	}
}

export const setCounts = ( counts ) => {
	return {
		type: 'SET_COUNTS',
		counts,
	}
}

export const setCount = ( key, count ) => {
	return {
		type: 'SET_COUNT',
		key,
		count,
	}
}

export const incrementCount = ( key ) => {
	return {
		type: 'INCREMENT_COUNT',
		key,
	}
}

export const decrementCount = ( key ) => {
	return {
		type: 'DECREMENT_COUNT',
		key,
	}
}

export const setLabels = ( labels ) => {
	return {
		type: 'SET_LABELS',
		labels,
	}
}

export const setWindow = config => {
	return {
		type: 'SET_WINDOW',
		config,
	}
}

export const toggleIsShowingUI = () => {
	return {
		type: 'TOGGLE_IS_SHOWING_UI'
	}
}

export const setBrightness = brightness => {
	return {
		type: 'SET_BRIGHTNESS',
		brightness,
	}
}

export const setShouldShowLabels = ( show = true ) => {
	return {
		type: 'SET_SHOULD_SHOW_LABELS',
		show,
	}
}

export const setHistory = ( index = 0, entries = [] ) => {
	return {
		type: 'SET_HISTORY',
		index,
		entries,
	}
}

export const setCurrentHistoryState = ( state ) => {
	return {
		type: 'SET_CURRENT_HISTORY_STATE',
		state,
	}
}

export const setSearchHistory = ( keyword ) => {
	return {
		type: 'SET_SEARCH_HISTORY',
		keyword,
	}
}

export const resetSearchHistory = ( terms = [] ) => {
	return {
		type: 'RESET_SEARCH_HISTORY',
		terms,
	}
}

export const registerSection = ( handle = '', config = {} ) => {
	return {
		type: 'REGISTER_SECTION',
		handle,
		config,
	}
}

export const setIsAppHidden = value => {
	return {
		type: 'SET_IS_APP_HIDDEN',
		value,
	}
}

export const setHasSubscribed = value => {
	return {
		type: 'SET_HAS_SUBSCRIBED',
		value,
	}
}

// Notices
export const createNotice = ( args, content = '' ) => {
	let config = args
	if ( 'string' === typeof args ) {
		config = {
			status: args,
			content
		}
	}
	return {
		type: 'CREATE_NOTICE',
		config
	}
}

export const removeNotice = ( id ) => {
	return {
		type: 'REMOVE_NOTICE',
		id,
	}
}
