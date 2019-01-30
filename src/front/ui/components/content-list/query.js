import React, { useEffect, useState } from 'react'
import { getContent } from 'utils/rest-api'
import { ContentList } from 'components'

export const ContentQuery = props => {
	const { type = 'posts', query } = props
	const [ results, setResults ] = useState( null )

	useEffect( () => {
		setResults( null )
		const request = getContent( type, query, data => setResults( data ) )
		return () => request.cancel()
	}, [ type, query ] )

	return <ContentList data={ results } { ...props } />
}
