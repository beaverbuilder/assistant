import React, { useEffect, useState } from 'react'
import { maybeUseAppState } from 'store'
import { useComponentUpdate } from 'utils/hooks'
import { getPagedContent } from 'utils/wordpress'
import { ContentList } from 'components'

export const ContentQuery = ( {
	type = 'posts',
	pagination = false,
	query = {},
	...props
} ) => {
	const [ results, setResults ] = maybeUseAppState( props, 'results', [] )
	const [ hasMore, setHasMore ] = maybeUseAppState( props, 'has-more', true )

	useComponentUpdate( () => {
		setHasMore( true )
		setResults( [] )
	}, [ type, JSON.stringify( query ) ] )

	const dataLoader = ( offset ) => {
		return getPagedContent( type, query, offset, ( data, more ) => {
			setHasMore( pagination && more ? true : false )
			setResults( results.concat( data ) )
		}, () => {
			setHasMore( false )
			setResults( [] )
		} )
	}

	return (
		<ContentList
			data={ results }
			dataHasMore={ hasMore }
			dataLoader={ dataLoader }
			dataSetter={ setResults }
			{ ...props }
		/>
	)
}
