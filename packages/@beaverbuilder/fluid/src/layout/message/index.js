import React from 'react'
import classname from 'classnames'
import './style.scss'

const Message = ( {
	status,
	icon: Icon,
	className,
	children,
	tag: Tag = 'div',
	...rest
} ) => {
	const classes = classname( 'fluid-message', {
		'fluid-status-alert': 'alert' == status,
		'fluid-status-destructive': 'destructive' == status,
		'fluid-status-primary': 'primary' == status
	}, className )

	return (
		<Tag className={ classes } { ...rest }>
			{ Icon && (
				<div className="fluid-message-icon">
					<Icon />
				</div>
			) }
			{children}
		</Tag>
	)
}

export default Message
