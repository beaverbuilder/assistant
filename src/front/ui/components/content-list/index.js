import React, { cloneElement, useEffect, useState } from 'react'
import classname from 'classnames'
import { getContent } from 'utils/rest-api'
import { Icon } from 'components'
import { ContentListContainer, ContentListItem } from './parts'
import './style.scss'

export const ContentList = ( {
	type = 'posts',
	query = null,
	container = <ContentListContainer />,
	containerClass = '',
	item = <ContentListItem />,
	itemClass = '',
	itemConfig = {
		showThumb: true,
		showMeta: true,
		showActions: true,
	}
} ) => {
	const [ results, setResults ] = useState( null )

	useEffect( () => {
		setResults( null )
		const request = getContent( type, query, data => setResults( data ) )
		return () => request.cancel()
    }, [ query ] )

	if ( ! results ) {
		return (
			<div className="fl-asst-list-loading">
				<Icon name="spinner" />
			</div>
		)
	} else if ( ! results.length ) {
		return (
			<div className="fl-asst-list-no-results">
				<span>No results found.</span>
			</div>
		)
	}

	return cloneElement( container, {
		className: classname( containerClass, 'fl-asst-list' ),
	}, results.map( ( result, key ) => cloneElement( item, {
		className: classname( itemClass, 'fl-asst-list-item' ),
		key,
		...itemConfig,
		...result,
	} ) ) )
}
