import React from 'react'
import { Icon, Button } from 'ui'
import classname from 'classnames'


export const Message = ({
	status,
	icon: Icon,
	children,
}) => {
	const messageClassName = classname({
		'fluid-button fluid-status-alert': (status == 'alert'),
		'fluid-button fluid-status-destructive': (status == 'destructive'),
		'fluid-button fluid-status-primary': (status == 'primary')
	})

	return (
		<div className={messageClassName}><Icon /> &nbsp;{' ' + children}</div>
	)
}


