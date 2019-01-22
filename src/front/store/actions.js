export function addApp( key, config ) {
	return {
		type: 'ADD_APP',
		key,
		config,
	}
}

export function updateActiveApp( key ) {
	return {
		type: 'UPDATE_ACTIVE_APP',
		key,
	}
}
