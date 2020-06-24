import cookie from 'cookie'

const FL_CLOUD_TOKEN_KEY = 'fl-cloud-token'
const FL_CLOUD_USER_KEY = 'fl-cloud-user'
const FL_CLOUD_SESSION_LENGTH = 1000 * 60 * 60 * 24 * 14

const subscribers = []

const notify = () => {
	const state = { token: getToken(), user: getUser() }
	subscribers.map( callback => callback( state ) )
}

export const subscribe = ( callback ) => {
	subscribers.push( callback )
}

export const create = ( token, user, remember ) => {
	setToken( token, remember )
	setUser( user, remember )
	notify()
}

export const destroy = () => {
	removeToken()
	removeUser()
	notify()
}

/**
 * Token methods
 */
export const isValidToken = ( token ) => {
	return token && 'string' === typeof token
}

export const hasToken = () => {
	return isValidToken( getToken() )
}

export const getToken = () => {
	return getCookie( FL_CLOUD_TOKEN_KEY )
}

export const setToken = ( token, remember ) => {
	setCookie( FL_CLOUD_TOKEN_KEY, token, remember )
}

export const removeToken = () => {
	removeCookie( FL_CLOUD_TOKEN_KEY )
}

/**
 * User methods
 */
export const isValidUser = ( user ) => {
	return user && 'object' === typeof user && user.hasOwnProperty( 'email' )
}

export const hasUser = () => {
	return isValidUser( getUser() )
}

export const getUser = () => {
	const user = getCookie( FL_CLOUD_USER_KEY )
	return user ? JSON.parse( user ) : null
}

export const setUser = ( user, remember ) => {
	setCookie( FL_CLOUD_USER_KEY, JSON.stringify( user ), remember )
}

export const removeUser = () => {
	removeCookie( FL_CLOUD_USER_KEY )
}

/**
 * Cookie helpers
 *
 * TODO: We're using localStorage here since cookies aren't working
 * correctly with webpack-serve. This needs to be figured out
 * at some point as localStorage isn't as secure as cookies.
 */
const setCookie = ( key, value, remember ) => {
	// const options = {
	// 	expires: new Date( Date.now() + FL_CLOUD_SESSION_LENGTH )
	// }
	// document.cookie = cookie.serialize( key, value, remember ? options : {} )

	localStorage.setItem( key, value )
}

const getCookie = ( key ) => {
	// const cookies = cookie.parse( document.cookie )
	// return cookies[ key ] ? cookies[ key ] : null

	return localStorage.getItem( key )
}

const removeCookie = ( key ) => {
	// document.cookie = cookie.serialize( key, '' )

	localStorage.setItem( key, '' )
}
