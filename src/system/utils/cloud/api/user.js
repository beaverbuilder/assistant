import http from '../http'

const api = {

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

const hooks = {

}

export default { ...api, ...hooks }
