import React from 'fl-react'
import classnames from 'classnames'

export const Panel = ( props ) => {

	const styles = {
		background: 'radial-gradient(circle, rgba(238,174,202,0.2) 0%, rgba(148,187,233,0.2) 100%)',
		border: '1px solid rgba(238,174,202, 0.1)',
		borderTop: '1px solid rgba(238,174,202, 0.1)',
		borderBottom: '1px solid rgba(238,174,202, 0.1)',
		display: 'flex',
		flexDirection: 'column',
		padding: 'var(--fl-asst-inner-space)'
	}

	const classes = classnames(
		'fl-asst-panel',
		props.className
	)

	return (
		<div className={ classes } style={ styles }>
			{props.children}
		</div>
	)
}
