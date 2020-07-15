import React from 'react'
import classname from 'classnames'

export const LockView = props => {
	const { children, className, isLock, ...rest } = props

	const classes = classname( {
		'fl-asst-lock-view': isLock ? true : false
	}, className )

	const merged = {
		...rest,
		className: classes
	}

	return (
		<div { ...merged }>
			<div>{children}</div>
		</div>
	)
}
