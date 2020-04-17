import { isObject } from 'lodash'

const FL_CLOUD_AUTH_STORAGE_KEY = 'fl-cloud-auth'
const FL_CLOUD_USER_KEY = 'fl-cloud-user'

export const isValidToken = ( token ) => {
	return 'string' === typeof token
}

export const hasToken = () => {
	const token = getToken()
	return isValidToken( token )
}

export const getToken = () => {
	try {
		const auth = localStorage.getItem( FL_CLOUD_AUTH_STORAGE_KEY )
		return JSON.parse( auth )
	} catch ( error ) {
		return null
	}

}

export const setToken = ( token ) => {
	localStorage.setItem( FL_CLOUD_AUTH_STORAGE_KEY, JSON.stringify( token ) )
}

export const removeToken = () => {
	localStorage.removeItem( FL_CLOUD_AUTH_STORAGE_KEY )
}

export const setUser = ( user ) => {
	localStorage.setItem( FL_CLOUD_USER_KEY, JSON.stringify( user ) )
}

export const getUser = () => {
	try {
		const user = localStorage.getItem( FL_CLOUD_USER_KEY )
		return JSON.parse( user )
	} catch ( error ) {
		console.log( 'Error getting user from localStorage', error ) // eslint-disable-line no-console
		return null
	}
}

export const removeUser = () => {
	localStorage.removeItem( FL_CLOUD_USER_KEY )
}

export const isValidUser = ( user ) => {
	return ( isObject( user ) && user.hasOwnProperty( 'email' ) )
}

export const hasUser = () => {
	const user = getUser()
	return isValidUser( user )
}
