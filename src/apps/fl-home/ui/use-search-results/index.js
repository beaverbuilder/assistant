import { useState, useEffect } from 'react'
import { CancelToken, isCancel } from 'axios'
import { getWpRest } from 'assistant/utils/wordpress'
import { getSystemActions, useAppState, getAppActions } from 'assistant/data'
import { getRequestConfig } from 'home/config'

export default () => {
	const { keyword = '' } = useAppState( 'fl-home' )
	const { setKeyword } = getAppActions( 'fl-home' )

	const [ isLoading, setIsLoading ] = useState( false )
	const [ results, setResults ] = useState( null )

	const { setSearchHistory } = getSystemActions()
	const wp = getWpRest()
	let source = CancelToken.source()
	const { config, routes } = getRequestConfig( { keyword } )

	// Every time keyword changes
	useEffect( () => {
		source.cancel()
		source = CancelToken.source()

		if ( '' !== keyword ) {
			setIsLoading( true )
			setResults( null )

			wp.search( keyword, routes, {
				cancelToken: source.token,
			} ).then( response => {
				const results = []

				response.data.map( ( result, key ) => {
					const { label, format } = config[ key ]
					if ( ! result.items || ! result.items.length ) {
						return
					}
					results.push( {
						label,
						configKey: key,
						items: format( result.items ).map( item => {
							return { ...item, configKey: key }
						} ),
					} )
				} )

				if ( results.length && '' !== keyword ) {
					setSearchHistory( keyword )
				}

				setResults( results )
				setIsLoading( false )
			} ).catch( ( error ) => {
				if ( ! isCancel( error ) ) {
					console.log( error ) // eslint-disable-line no-console
				}
			} )
		}

		return () => source.cancel()
	}, [ keyword ] )

	return {
		results,
		clearResults: () => setResults( null ),
		isLoading,
		keyword,
		setKeyword
	}
}
