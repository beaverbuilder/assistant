import http from './http'

export default {
	update: ( data ) => {
		return http.put( '/account/user/update', data )
	},
	updatePassword: ( data ) => {
		return new Promise( ( resolve ) => {
			setTimeout( () => {
				resolve()
			}, 1000 )
		} )
	},
}
