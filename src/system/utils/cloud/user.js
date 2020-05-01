import http from './http'

export default {
	update: ( data ) => {
		return http.put( '/account/user/update', data )
	}
}
