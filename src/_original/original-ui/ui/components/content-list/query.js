import React, { useState } from 'react'
import { useComponentUpdate } from 'shared-utils/hooks'
import { getPagedContent } from 'shared-utils/wordpress'
import { ContentList } from 'components'

export const ContentQuery = ( {
	type = 'posts',
	pagination = false,
	query,
	...props
} ) => {
	const [ loading, setLoading ] = useState( false )
	const [ hasMore, setHasMore ] = useState( true )
	const [ results, setResults ] = useState( [] )

	const dataLoader = ( offset ) => {
		setLoading( true )
		setHasMore( false )
		return getPagedContent( type, query, offset, ( data, more ) => {
			setLoading( false )
			setHasMore( pagination && more ? true : false )
			setResults( results.concat( data ) )
		}, () => {
			setLoading( false )
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
			dataLoading={ loading }
			dataSetter={ setResults }
			{ ...props }
		/>
	)
}
