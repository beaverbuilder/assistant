import React from 'react'
import classname from 'classnames'

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

export const ContentListItem = ( { className, data, onClick, children } ) => {
	const { meta, thumbnail, title, url } = data

	const thumbStyles = {
		backgroundImage: thumbnail ? `url(${ thumbnail })` : '',
	}

	const view = () => {
		if ( onClick ) {
			onClick( data )
		} else if ( url ) {
			window.location.href = url
		}
	}

	return (
		<div className={ classname( className, 'fl-asst-list-item' ) } onClick={ view }>
			<div className="fl-asst-list-item-visual">
				<div className="fl-asst-list-item-image-box" style={ thumbStyles }></div>
			</div>
			<div className="fl-asst-list-item-content">
				<div className="fl-asst-list-item-title">{ title }</div>
				<div className="fl-asst-list-item-meta">
					{ meta }
				</div>
			</div>
			{ children }
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
