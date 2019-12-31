import React from 'react'
import { Icon } from 'ui'
import classname from 'classnames'
import './style.scss'


export const Message = ( {
	status,
	icon: Icon,
	children,
} ) => {
	const messageClassName = classname( {
		'fluid-message fluid-status-alert': ( 'alert' == status ),
		'fluid-message fluid-status-destructive': ( 'destructive' == status ),
		'fluid-message fluid-status-primary': ( 'primary' == status )
	} )

	return (
		<div className={ messageClassName }><Icon /> &nbsp;{' ' + children}</div>
	)
}


