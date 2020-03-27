export const setIsCloudConnected = ( isConnected ) => {
	return {
		type: 'SET_IS_CLOUD_CONNECTED',
		isConnected
	}
}

export const setCloudToken = ( token ) => {
	return {
		type: 'SET_CLOUD_TOKEN',
		token
	}
}

export const setCloudErrors = ( errors ) => {
	return {
		type: 'SET_CLOUD_ERRORS',
		errors
	}
}

export const setCloudUser = ( user ) => {
	return {
		type: 'SET_CLOUD_USER',
		user
	}
}

export const fetchCloudUser = () => {
	return {
		type: 'FETCH_CLOUD_USER'
	}
}

export const attemptCloudRegister = ( email, password ) => {
	return {
		type: 'ATTEMPT_CLOUD_REGISTER',
		email,
		password
	}
}

export const attemptCloudLogin = ( email, password ) => {
	return {
		type: 'ATTEMPT_CLOUD_LOGIN',
		email,
		password
	}
}

export const attemptCloudLogout = () => {
	return {
		type: 'ATTEMPT_CLOUD_LOGOUT'
	}
}
