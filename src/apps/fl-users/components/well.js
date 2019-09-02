import React from 'fl-react'
import classnames from 'classnames'

export const Well = ( props ) => {

	const style = {
		background: 'var(--fl-asst-secondary-surface-background)',
		borderRadius: 15,
		padding: '20px',
		width: '100%',
	}

	const classes = classnames(
		'fl-asst-well',
		props.className
	)
	return (
		<div className={ classes } style={ style }>
			{ props.children }
		</div>
	)
}
