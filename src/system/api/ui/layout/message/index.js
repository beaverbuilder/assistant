import React from 'react'
import classname from 'classnames'
import './style.scss'

const Message = ( {
	status,
	icon: Icon,
	children,
} ) => {
	const messageClassName = classname( {
		'fl-asst-message': true,
		'fluid-status-alert': 'alert' == status,
		'fluid-status-destructive': 'destructive' == status,
		'fluid-status-primary': 'primary' == status
	} )

	return (
		<div className={ messageClassName }>
			{ Icon && <div className="fl-msg-icon"><Icon /></div> }
			{children}
		</div>
	)
}

export default Message
