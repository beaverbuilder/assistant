import React, { Fragment } from 'react'
import classname from 'classnames'

export const LockView = props => {
	const { children, className, isLock } = props

	const classes = classname(
		{
			'fl-asst-lock-view': isLock ? true : false
		},
		className
	)

	const merged = {
		...props,
		className: classes
	}

	return (
		<Fragment>
			<div {...merged}>
				<div>{children}</div>
			</div>
		</Fragment>
	)
}
