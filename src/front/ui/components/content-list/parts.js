import React, { useContext, useLayoutEffect, createRef } from 'react'
import classname from 'classnames'
import Truncate from 'react-truncate'
import ResizeObserver from 'resize-observer-polyfill'
import { EmptyMessage, ItemContext } from 'components'

export const ContentListContainer = ( { className, children } ) => {
	return (
		<div className={ classname( className, 'fl-asst-list' ) }>
			{ children }
		</div>
	)
}

export const ContentListGroupLabel = ( { label } ) => {
	return (
		<div className='fl-asst-list-group-heading'>
			{ label }
		</div>
	)
}

export const ContentListItem = props => {
	const { meta, thumbnail, title, isFirstItem, truncateWidth, setTruncateWidth } = useContext( ItemContext ) || {}
	const { className, children, onClick } = props
	const ref = createRef()
	const classes = classname( className, 'fl-asst-list-item' )
	const thumbStyles = {
		backgroundImage: thumbnail ? `url(${ thumbnail })` : '',
	}

	const contentLineCount = 2

	useLayoutEffect( () => {
		if ( isFirstItem && 'undefined' !== typeof ref.current ) {

			let id = null
			const measure = entries => {
				const { contentRect: { width } } = entries[0]
				id = requestAnimationFrame( () => {
					setTruncateWidth( width )
				} )
			}

			const observer = new ResizeObserver( measure )
			observer.observe( ref.current )

			return () => {
				cancelAnimationFrame( id )
				observer.disconnect()
			}
		}
	}, [] )

	return (
		<div className={ classes } onClick={ onClick }>
			<div className="fl-asst-list-item-visual">
				<div className="fl-asst-list-item-image-box" style={ thumbStyles }></div>
			</div>
			<div className="fl-asst-list-item-content" ref={ref}>
				<div className="fl-asst-list-item-title">
					<Truncate lines={contentLineCount} width={truncateWidth}>{title}</Truncate>
				</div>
				<div className="fl-asst-list-item-meta">
					{ meta }
				</div>
			</div>
			{children}
		</div>
	)
}

export const ContentListItemLoading = ( { className } ) => {
	const context = {
		meta: 'Loading...',
		title: 'Loading...',
	}
	const classes = classname( className, 'fl-asst-list-item-loading' )
	return (
		<ItemContext.Provider value={ context }>
			<ContentListItem className={ classes } />
		</ItemContext.Provider>
	)
}

export const ContentListDetail = ( { className, children } ) => {
	return (
		<div className={ classname( className, 'fl-asst-list-detail' ) }>
			{ children }
		</div>
	)
}

export const ContentListEmptyMessage = () => {
	return <EmptyMessage>No Results Found</EmptyMessage>
}
