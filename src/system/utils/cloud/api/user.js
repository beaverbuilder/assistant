export default ( http ) => {

	const api = {

		update: ( data ) => {
			return http.put( '/account/user/update', data )
		},

		updatePassword: ( data ) => {
			return new Promise( ( resolve ) => {
				setTimeout( () => {
					resolve( data )
				}, 1000 )
			} )
		},
	}

	const hooks = {

	}

	return { ...api, ...hooks }
}
