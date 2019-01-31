import React, { useEffect, useState } from 'react'
import { getContent } from 'utils/rest-api'
import { ContentList } from 'components'

export const ContentQuery = ( {
	type = 'posts',
	pagination = false,
	query,
	...props
} ) => {
	const [ results, setResults ] = useState( null )
	const [ hasMore, setHasMore ] = useState( true )

	const dataLoader = () => {
		let paged = Object.assign( {}, query )
		let perPage = 10

		if ( 'posts' === type ) {
			paged.offset = results ? results.length : 0
			paged.posts_per_page = paged.posts_per_page ? paged.posts_per_page : perPage
			perPage = paged.posts_per_page
		}

		return getContent( type, paged, data => {
			if ( data.length < perPage ) {
				setHasMore( false )
			}
			if ( data.length ) {
				setResults( results ? results.concat( data ) : data )
			}
		} )
	}

	useEffect( () => {
		setResults( null )
		setHasMore( true )
		const request = dataLoader()
		return () => request.cancel()
	}, [ type, query ] )

	return (
		<ContentList
			data={ results }
			dataHasMore={ hasMore }
			dataLoader={ pagination && query ? dataLoader : null }
			{ ...props }
		/>
	)
}
