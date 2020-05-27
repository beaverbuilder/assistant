import cookie from 'cookie'
import { isObject } from 'lodash'
import { getCloudActions } from 'data/cloud'

const FL_CLOUD_TOKEN_KEY = 'fl-asst-cloud-token'
const FL_CLOUD_USER_KEY = 'fl-asst-cloud-user'

export const create = ( token, user ) => {
	const { setCloudToken, setCloudUser, setIsCloudConnected } = getCloudActions()
	setToken( token )
	setUser( user )
	setCloudToken( token )
	setCloudUser( user )
	setIsCloudConnected( true )
}

export const destroy = () => {
	const { setCloudToken, setCloudUser, setIsCloudConnected } = getCloudActions()
	setCloudToken( {} )
	setCloudUser( null )
	setIsCloudConnected( false )
	removeToken()
	removeUser()
}

export const isValidToken = ( token ) => {
	return token && 'string' === typeof token
}

export const hasToken = () => {
	const token = getToken()
	return isValidToken( token )
}

export const getToken = () => {
	const cookies = cookie.parse( document.cookie )
	return cookies[ FL_CLOUD_TOKEN_KEY ] ? cookies[ FL_CLOUD_TOKEN_KEY ] : null
}

export const setToken = ( token ) => {
	document.cookie = cookie.serialize( FL_CLOUD_TOKEN_KEY, token, {
		expires: new Date( Date.now() + 1000 * 60 * 60 * 24 * 14 )
	} )
}

export const removeToken = () => {
	document.cookie = cookie.serialize( FL_CLOUD_TOKEN_KEY, '' )
}

export const isValidUser = ( user ) => {
	return ( isObject( user ) && user.hasOwnProperty( 'email' ) )
}

export const hasUser = () => {
	const user = getUser()
	return isValidUser( user )
}

export const getUser = () => {
	const cookies = cookie.parse( document.cookie )
	return cookies[ FL_CLOUD_USER_KEY ] ? JSON.parse( cookies[ FL_CLOUD_USER_KEY ] ) : null
}

export const setUser = ( user ) => {
	document.cookie = cookie.serialize( FL_CLOUD_USER_KEY, JSON.stringify( user ), {
		expires: new Date( Date.now() + 1000 * 60 * 60 * 24 * 14 )
	} )
}

export const removeUser = () => {
	document.cookie = cookie.serialize( FL_CLOUD_USER_KEY, '' )
}
