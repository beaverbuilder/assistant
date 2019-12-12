import React from 'react'
import classname from 'classnames'
import Clipboard from 'react-clipboard.js'
import { Icon } from 'ui'
import './style.scss'

export const URLControl = ( { value: url, className, ...rest } ) => {
	const classes = classname( 'fl-asst-control-url', className )
	return (
		<div className={ classes } { ...rest }>
			<div className="fl-asst-control-url-wrap">
				<a href={ url }>{url}</a>
			</div>
			<div className="fl-asst-control-url-actions">
				<Clipboard data-clipboard-text={ url } button-className={ 'fluid-button' }><Icon.Link /></Clipboard>
			</div>
		</div>
	)
}
