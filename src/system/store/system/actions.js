export const setIsShowingUI = ( show ) => {
	return {
		type: 'SET_SHOW_UI',
		show,
	}
}

// Deprecated
export const setPanelPosition = position => {
	return {
		type: 'SET_PANEL_POSITION',
		position,
	}
}

// Deprecated
export const togglePanelPosition = () => {
	return {
		type: 'TOGGLE_PANEL_POSITION'
	}
}

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

export const setActiveApp = ( key ) => {
	return {
		type: 'SET_ACTIVE_APP',
		key,
	}
}

export const setAppPosition = ( key, position ) => {
	return {
		type: 'SET_APP_POSITION',
		key,
		position,
	}
}

export const setAppFrameSize = size => {
	return {
		type: 'SET_APP_FRAME_SIZE',
		size
	}
}

export const setIsShowingAppsMenu = isShowing => {
	return {
		type: 'SET_IS_SHOWING_APPS_MENU',
		isShowing,
	}
}

export const hideAppsMenu = () => {
	return {
		type: 'SET_IS_SHOWING_APPS_MENU',
		isShowing: false
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
