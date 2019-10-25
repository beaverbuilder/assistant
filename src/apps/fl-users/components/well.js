import React from 'react'
import classnames from 'classnames'

export const Well = ( { className, style: initialStyles, ...rest } ) => {

	const style = {
		...initialStyles,
		background: 'var(--fl-asst-secondary-surface-background)',
		borderRadius: 15,
		padding: '20px',
		width: '100%',
	}

	const classes = classnames(
		'fl-asst-secondary-surface',
		className
	)
	return (
		<div className={ classes } style={ style } { ...rest } />
	)
}
