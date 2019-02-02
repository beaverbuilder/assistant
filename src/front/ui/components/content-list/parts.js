import React from 'react'
import classname from 'classnames'

export const ContentListContainer = ( { className, children } ) => {
	return (
		<ul className={ classname( className, 'fl-asst-list' ) }>
			{ children }
		</ul>
	)
}

export const ContentListGroupLabel = ( { label } ) => {
	return (
		<li className='fl-asst-list-group-heading'>
			{ label }
		</li>
	)
}

export const ContentListItem = ( {
	url = null,
	thumbnail = null,
	title = '',
	author = '',
	date = '',
	className = '',
	itemThumb = true,
	itemMeta = true,
} ) => {

	const view = () => url ? window.location.href = url : null
	const thumbStyles = {
		backgroundImage: thumbnail ? `url(${ thumbnail })` : '',
	}

	return (
		<li className={ classname( className, 'fl-asst-list-item' ) }>
			{ itemThumb &&
				<div className="fl-asst-list-item-visual" onClick={ view }>
					<div className="fl-asst-list-item-image-box" style={ thumbStyles }></div>
				</div>
			}
			<div className="fl-asst-list-item-content" onClick={ view }>
				<div className="fl-asst-list-item-title">{ title }</div>
				{ itemMeta && ( author || date ) &&
					<div className="fl-asst-list-item-meta">
						{ author && <span>By { author }</span> }
						{ author && date && <span> - </span> }
						{ date && <span>{ date }</span> }
					</div>
				}
			</div>
		</li>
	)
}

export const ContentListItemLoading = ( { className } ) => {
	return (
		<ContentListItem
			className={ classname( className, 'fl-asst-list-item-loading' ) }
			itemActions={ false }
			author='Loading...'
			title='Loading...'
		/>
	)
}
