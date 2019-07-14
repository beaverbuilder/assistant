import cloud from 'shared-utils/cloud'

export const setShouldReduceMotion = shouldReduce => {
	return {
		type: 'SET_SHOULD_REDUCE_MOTION',
		shouldReduce,
	}
}

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

// New UI Actions
export const setWindow = config => {
	return {
		type: 'SET_WINDOW',
		config,
	}
}

export const setBrightness = brightness => {
	return {
		type: 'SET_BRIGHTNESS',
		brightness,
	}
}

export const setShouldShowLabels = ( show =  true ) => {
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

export const setSearchHistory = ( keyword ) => {
	return {
		type: 'SET_SEARCH_HISTORY',
		keyword,
	}
}


export const doLogin = (email, password) => {
	return {
		type: 'DO_LOGIN',
		email,
		password
	}
}

export const doLogout = () => {
	return {
		type: 'DO_LOGOUT'
	}
}

export const setDoingLogin = (doingLogin) => {
	return {
		type: 'DOING_LOGIN',
		doingLogin
	}
}

export const setIsCloudConnected = (isCloudConnected) => {
	return {
		type: 'SET_IS_CLOUD_CONNECTED',
		isCloudConnected
	}
}

export const addNotice = (message) => {
	return {
		type: 'SET_NOTICE',
		message
	}
}

export const clearNotices = () => {
	return {
		type: 'CLEAR_NOTICES'
	}
}

export const addError = (message) => {
	return {
		type: 'SET_ERROR',
		message
	}
}

export const clearErrors = () => {
	return {
		type: 'CLEAR_ERRORS'
	}
}

export const setCloudToken = (cloudToken) => {
	return {
		type: 'SET_CLOUD_TOKEN',
		cloudToken
	}
}

export const setCloudUser = (user) => {
	return {
		type: 'SET_CLOUD_USER',
		user
	}
}

