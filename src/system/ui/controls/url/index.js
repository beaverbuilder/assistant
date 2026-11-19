import React from 'react'
import classname from 'classnames'
import copy from 'copy-to-clipboard'
import { Button, Icon } from 'ui'
import './style.scss'

export const URLControl = ( { value: url, className, ...rest } ) => {
	const classes = classname( 'fl-asst-control-url', className )
	return (
		<div className={ classes } { ...rest }>
			<div className="fl-asst-control-url-wrap">
				<a href={ url }>{url}</a>
			</div>
			<div className="fl-asst-control-url-actions">
				<Button appearance="transparent" onClick={ () => copy( url ) }><Icon.Link /></Button>
			</div>
		</div>
	)
}
