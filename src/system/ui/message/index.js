import React from 'react'
import { Icon, Button } from 'ui'
import classname from 'classnames'
import './style.scss'


export const Message = ({
	status,
	icon: Icon,
	children,
}) => {
	const messageClassName = classname({
		'fluid-message fluid-status-alert': (status == 'alert'),
		'fluid-message fluid-status-destructive': (status == 'destructive'),
		'fluid-message fluid-status-primary': (status == 'primary')
	})

	return (
		<div className={messageClassName}><Icon /> &nbsp;{' ' + children}</div>
	)
}


