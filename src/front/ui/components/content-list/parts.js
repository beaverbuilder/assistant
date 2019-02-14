import React from 'react'
import classname from 'classnames'
import { EmptyMessage } from 'components'

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
	const { className, children, data, onClick } = props
	const { meta, thumbnail, title } = data
	const classes = classname( className, 'fl-asst-list-item' )
	const thumbStyles = {
		backgroundImage: thumbnail ? `url(${ thumbnail })` : '',
	}
	return (
		<div className={ classes } onClick={ () => onClick && onClick( data ) }>
			<div className="fl-asst-list-item-visual">
				<div className="fl-asst-list-item-image-box" style={ thumbStyles }></div>
			</div>
			<div className="fl-asst-list-item-content">
				<div className="fl-asst-list-item-title">{ title }</div>
				<div className="fl-asst-list-item-meta">
					{ meta }
				</div>
			</div>
			{children}
		</div>
	)
}

export const ContentListItemLoading = ( { className } ) => {
	const data = {
		meta: 'Loading...',
		title: 'Loading...',
	}
	return (
		<ContentListItem
			className={ classname( className, 'fl-asst-list-item-loading' ) }
			data={ data }
		/>
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
