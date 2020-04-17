export const isCloudConnected = ( state = false, action ) => {
	switch ( action.type ) {
	case 'SET_IS_CLOUD_CONNECTED':
		return action.isConnected
	default:
		return state
	}
}

export const cloudToken = ( state = {}, action ) => {
	switch ( action.type ) {
	case 'SET_CLOUD_TOKEN':
		return action.token
	default:
		return state
	}
}

export const cloudUser = ( state = null, action ) => {
	switch ( action.type ) {
	case 'SET_CLOUD_USER':
		return action.user
	default:
		return state
	}
}
