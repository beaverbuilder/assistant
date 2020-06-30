import { useEffect, useState } from 'react'

export const useApiResource = ( id, {
	model,
	getter,
	subscribe,
	unsubscribe
} ) => {
	const [ resource, setResource ] = useState( null )

	useEffect( () => {
		getter( id ).then( response => setResource( response.data ) )
	}, [ id ] )

	useEffect( () => {
		if ( resource && subscribe ) {
			subscribe( id, 'updated', event => setResource( event[ model ] ) )
			subscribe( id, 'deleted', () => setResource( null ) )
			return () => unsubscribe && unsubscribe( id )
		}
	}, [ resource ] )

	return [ resource, setResource ]
}

export const useApiCollection = ( {
	model,
	getter,
	subscribe,
	unsubscribe
} ) => {
	const [ collection, setCollection ] = useState( null )

	useEffect( () => {
		setCollection( null )
		getter().then( response => setCollection( response.data ) )
	}, [ getter ] )

	useEffect( () => {
		if ( subscribe && collection ) {
			subscribe( null, 'created', event => {
				let found = false
				collection.map( item => {
					if ( item.id === event[ model ].id ) {
						found = true
					}
				} )
				if ( ! found ) {
					setCollection( collection.concat( [ event[ model ] ] ) )
				}
			} )
			collection.map( ( { id } ) => {
				subscribe( id, 'updated', event => {
					setCollection( collection.map( item => item.id === id ? event[ model ] : item ) )
				} )
				subscribe( id, 'deleted', () => {
					setCollection( collection.filter( item => item.id !== id ) )
				} )
			} )
			return () => collection.map( item => unsubscribe( item.id ) )
		}
	}, [ collection ] )

	return [ collection, setCollection ]
}
