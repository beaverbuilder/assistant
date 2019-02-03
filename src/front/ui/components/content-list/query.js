import React, { useEffect, useState } from 'react'
import { getPagedContent } from 'utils/rest-api'
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
		setResults( [] )
		setHasMore( true )
	}, [ type, query ] )

	const dataLoader = ( offset ) => {
		return getPagedContent( type, query, offset, ( data, more ) => {
			setHasMore( pagination && more ? true : false )
			setResults( results.concat( data ) )
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
