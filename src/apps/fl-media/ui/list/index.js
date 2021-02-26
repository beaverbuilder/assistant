import React from 'react'
import { Layout } from 'assistant/ui'
import { useMediaApp } from '../../data'
import './style.scss'

const hasReachedBounds = e => {
	const { scrollTop, clientHeight, scrollHeight } = e.target
	const bottom = scrollTop + clientHeight
	return bottom + 150 >= scrollHeight
}

const MediaList = () => {
	const { items, isFetching, loadItems, hasMore } = useMediaApp()

	const onScroll = e => {
		if ( hasMore && hasReachedBounds( e ) && ! isFetching ) {
			loadItems( items.length )
		}
	}

	return (
		<div className="fl-asst-media-app-list-scroller" onScroll={ onScroll }>
			<ul className="fl-asst-media-app-list">
				{ items.map( item => {
					const { id, thumbnail } = item
					return (
						<li key={ id }>
							<Layout.AspectBox
								style={ {
									backgroundImage: `url(${thumbnail})`,
									backgroundSize: 'contain',
								} }
							/>
						</li>
					)
				} ) }
			</ul>
		</div>
	)
}

export default MediaList
