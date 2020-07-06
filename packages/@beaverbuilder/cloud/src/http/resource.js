import cogent from 'cogent-js'

export const createApiResource = ( endpoint, http ) => {
	return {
		create: ( data ) => http.post( endpoint, data ),
		update: ( id, data ) => http.put( `${ endpoint }/${ id }`, data ),
		delete: ( id ) => http.delete( `${ endpoint }/${ id }` ),
		get: ( id ) => http.get( `${ endpoint }/${ id }` ),
		getAll: () => http.get( endpoint ),
		search: ( callback = () => {} ) => {
			const route = callback( new cogent.Query().for( endpoint ) ).get()
			return http.get( route.replace( '//', '/' ) )
		},
	}
}
