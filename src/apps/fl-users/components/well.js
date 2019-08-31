import React from 'fl-react'
import classnames from 'classnames'

export const Well = ( props ) => {

	const style = {
		background: 'radial-gradient(circle, rgba(238,174,202,0.2) 0%, rgba(148,187,233,0.2) 100%)',
		border: '1px solid rgba(238,174,202, 0.1)',
		borderRadius: 'var(--fl-asst-base-radius)',
		padding: '20px',
		width: '100%',
		marginBottom: '15px'
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
