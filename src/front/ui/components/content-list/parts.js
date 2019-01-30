import React from 'react'
import { Button } from 'components'

export const ContentListContainer = ( { className, children } ) => {
	return (
		<ul className={ className }>
			{ children }
		</ul>
	)
}

export const ContentListItem = ( {
	url = null,
	edit_url = null,
	thumbnail = null,
	title = '',
	author = '',
	date = '',
	className = '',
	itemThumb = true,
	itemMeta = true,
	itemActions = true,
} ) => {

	const view = () => url ? window.location.href = url : null
	const edit = () => edit_url ? window.location.href = edit_url : null
	const thumbStyles = {
		backgroundImage: thumbnail ? `url(${ thumbnail })` : '',
	}

	return (
		<li className={ className }>
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
			{ itemActions &&
				<div className="fl-asst-list-item-actions">
					<Button onClick={ view }>View</Button>
					<Button onClick={ edit }>Edit</Button>
				</div>
			}
		</li>
	)
}
