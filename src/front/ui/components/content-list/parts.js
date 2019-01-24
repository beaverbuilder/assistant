import React from 'react'
import { Icon, Button } from 'components'

export const ContentListContainer = ( { className, children } ) => {
	return (
		<ul className={ className }>
			{ children }
		</ul>
	)
}

export const ContentListItem = ( {
	url = window.location.href,
	edit_url = window.location.href,
	thumbnail = null,
	title = '',
	author = '',
	date = '',
	className = ''
} ) => {

    const viewPost = () => window.location.href = url
    const editPost = () => window.location.href = edit_url
    const thumbStyles = {
        backgroundImage: thumbnail ? `url(${ thumbnail })` : '',
    }

    return (
        <li className={ className }>
            <div className="fl-asst-list-item-visual" onClick={ viewPost }>
                <div className="fl-asst-list-item-image-box" style={ thumbStyles }></div>
            </div>
            <div className="fl-asst-list-item-content" onClick={ viewPost }>
                <div className="fl-asst-list-item-title">{ title }</div>
                <div className="fl-asst-list-item-meta">By { author } - { date }</div>
            </div>
            <div className="fl-asst-list-item-actions">
                <Button onClick={ viewPost }>View</Button>
                <Button onClick={ editPost }>Edit</Button>
                <Button><Icon name="star-outline" /></Button>
                <Button><Icon name="more" /></Button>
            </div>
        </li>
    )
}
