import { useEffect, useState } from 'react'
import http from '../http'

export const useAll = ( endpoint ) => {
	return () => {
		const [ items, setItems ] = useState( null )
		useEffect( () => {
			http.get( endpoint ).then( response => {
				setItems( response.data )
			} )
		}, [] )
		return [ items, setItems ]
	}
}

export const useOne = ( endpoint ) => {
	return ( id ) => {
		const [ item, setItem ] = useState( null )
		useEffect( () => {
			if ( id ) {
				http.get( `${ endpoint }/${ id }` ).then( response => {
					setItem( response.data )
				} )
			}
		}, [ id ] )
		return [ item, setItem ]
	}
}
