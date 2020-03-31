import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import classname from 'classnames'

const Button = forwardRef( ( props, ref ) => {
	const {
		className,
		to,
		href,
		onClick,
		isSelected = false,
		appearance,
		status,
		...rest
	} = props

	const classes = classname( {
		'fluid-button': true,
		'is-selected': isSelected,
		[`fluid-status-${status}`]: status,
		[`fluid-appearance-${appearance}`]: appearance
	}, className )

	let newProps = {
		...rest,
		ref,
		className: classes,
		role: 'button',
	}

	// Determine the tag for this button based on props.
	let Tag = 'button'
	if ( to || href ) {

		// Routing Link
		Tag = 'a'
		if ( href ) {
			newProps.href = href
		} else {
			Tag = Link
			newProps.to = to
		}
	} else {
		newProps.onClick = onClick
	}

	return (
		<Tag { ...newProps } />
	)
} )

export default Button
