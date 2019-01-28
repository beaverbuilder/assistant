export function registerApp( key, config ) {
	return {
		type: 'REGISTER_APP',
		key,
		config,
	}
}

export function setActiveApp( key ) {
	return {
		type: 'SET_ACTIVE_APP',
		key,
	}
}

export function travisTesting() {
	return true
}
