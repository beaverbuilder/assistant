import React, { useEffect, useState } from 'react'
import { getPagedContent } from 'utils/wordpress'
import { ContentList } from 'components'

export const ContentQuery = ( {
	type = 'posts',
	pagination = false,
	query,
	...props
} ) => {
	const [ results, setResults ] = useState( [] )
	const [ hasMore, setHasMore ] = useState( true )

	useEffect( () => {
		setHasMore( true )
		setResults( [] )
	}, [ type, query ] )

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
