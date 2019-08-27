import React from 'fl-react'
import { __ } from '@wordpress/i18n'
import classname from 'fl-classnames'
import Clipboard from 'react-clipboard.js'
import './style.scss'

export const URLControl = ( { url, className } ) => {
	const classes = classname( {
		'fl-asst-control-url': true,
	}, className )

	return (
		<div className={ classes }>
			<div className="fl-asst-control-url-wrap">
				<a href={ url }>{url}</a>
			</div>
			<div className="fl-asst-control-url-actions">
				<Clipboard data-clipboard-text={ url } button-className={ 'fl-asst-button' }>{__( 'Copy' )}</Clipboard>
			</div>
		</div>
	)
}
