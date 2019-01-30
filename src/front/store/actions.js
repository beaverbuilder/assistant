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

export const hydrateAppState = ( app, state ) => {
	return {
		type: 'HYDRATE_APP_STATE',
		app,
		state,
	}
}

export const setAppState = ( app, key, value ) => {
	return {
		type: 'SET_APP_STATE',
		app,
		key,
		value,
	}
}

export const setShowUI = ( show ) => {
	return {
		type: 'SET_SHOW_UI',
		show,
	}
}
