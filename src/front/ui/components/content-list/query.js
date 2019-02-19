import React, { useState } from 'react'
import { useComponentUpdate } from 'utils/hooks'
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

	const dataLoader = ( offset ) => {
		return getPagedContent( type, query, offset, ( data, more ) => {
			setHasMore( pagination && more ? true : false )
			setResults( results.concat( data ) )
		}, () => {
			setHasMore( false )
			setResults( [] )
		} )
	}

	useComponentUpdate( () => {
		setHasMore( true )
		setResults( [] )
	}, [ type, JSON.stringify( query ) ] )

	return ( ! query ? null :
		<ContentList
			data={ results }
			dataHasMore={ hasMore }
			dataLoader={ dataLoader }
			dataSetter={ setResults }
			{ ...props }
		/>
	)
}
