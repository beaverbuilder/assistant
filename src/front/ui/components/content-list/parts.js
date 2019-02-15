import React, { useContext } from 'react'
import classname from 'classnames'
import { truncate } from 'utils/text'
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
	const { meta, thumbnail, title } = useContext( ItemContext ) || {}
	const { className, children, onClick } = props
	const classes = classname( className, 'fl-asst-list-item' )
	const thumbStyles = {
		backgroundImage: thumbnail ? `url(${ thumbnail })` : '',
	}
	return (
		<div className={ classes } onClick={ onClick }>
			<div className="fl-asst-list-item-visual">
				<div className="fl-asst-list-item-image-box" style={ thumbStyles }></div>
			</div>
			<div className="fl-asst-list-item-content">
				<div className="fl-asst-list-item-title">{ truncate( title, 6 ) }</div>
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
