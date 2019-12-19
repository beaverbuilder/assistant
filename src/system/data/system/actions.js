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

export const setOverlayToolbar = value => {
	return {
		type: 'SET_OVERLAY_TOOLBAR',
		value,
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

export const setIsCloudConnected = ( isCloudConnected ) => {
	return {
		type: 'SET_IS_CLOUD_CONNECTED',
		isCloudConnected
	}
}

export const setCloudToken = ( token ) => {
	return {
		type: 'SET_CLOUD_TOKEN',
		token
	}
}

export const setLoginErrors = ( errors ) => {
	return {
		type: 'SET_LOGIN_ERRORS',
		errors
	}
}

export const setCurrentUser = ( user ) => {
	return {
		type: 'SET_CURRENT_USER',
		user
	}
}

export const fetchCurrentUser = () => {
	return {
		type: 'FETCH_CURRENT_USER'
	}
}

export const attemptLogin = ( email, password ) => {
	return {
		type: 'ATTEMPT_LOGIN',
		email,
		password
	}
}

export const attemptLogout = () => {
	return {
		type: 'ATTEMPT_LOGOUT'
	}
}

export const registerSection = ( handle = '', config = {} ) => {
	return {
		type: 'REGISTER_SECTION',
		handle,
		config,
	}
}
