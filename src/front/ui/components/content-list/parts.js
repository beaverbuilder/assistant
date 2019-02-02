import React from 'react'
import classname from 'classnames'

export const ContentListContainer = ( { className, children } ) => {
	return (
		<ul className={ classname( className, 'fl-asst-list' ) }>
			{ children }
		</ul>
	)
}

export const ContentListItem = ( { className, data, onClick } ) => {
	const { author, date, thumbnail, title, url } = data

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
		<li className={ classname( className, 'fl-asst-list-item' ) } onClick={ view }>
			<div className="fl-asst-list-item-visual">
				<div className="fl-asst-list-item-image-box" style={ thumbStyles }></div>
			</div>
			<div className="fl-asst-list-item-content">
				<div className="fl-asst-list-item-title">{ title }</div>
				{ ( author || date ) &&
					<div className="fl-asst-list-item-meta">
						{ author && <span>{ author }</span> }
						{ author && date && <span> - </span> }
						{ date && <span>{ date }</span> }
					</div>
				}
			</div>
		</li>
	)
}

export const ContentListItemLoading = ( { className } ) => {
	const data = {
		author: 'Loading...',
		title: 'Loading...',
	}
	return (
		<ContentListItem
			className={ classname( className, 'fl-asst-list-item-loading' ) }
			data={ data }
		/>
	)
}
