import React, { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import c from 'classnames'
import * as Icon from '../../icon'

const Button = forwardRef( ( props, ref ) => {
	const {
		tag,
		className,
		to,
		href,
		onClick,
		isSelected = false,
		appearance = 'normal',
		status,
		icon,
		loading = false,
		children,
		...rest
	} = props

	const classes = c( 'fluid-button', {
		'is-selected': isSelected,
		[`fluid-status-${status}`]: status,
		[`fluid-appearance-${appearance}`]: appearance
	}, className )

	let newProps = {
		ref,
		className: classes,
		role: 'button',
		...rest
	}

	// Determine the tag for this button based on props.
	let Component = 'button'

	if ( tag ) { // Passing a component overrides everything
		Component = tag
	} else if ( to || href ) {
		Component = 'a'
		if ( href ) {
			newProps.href = href
		} else {
			Component = Link
			newProps.to = to
		}
	} else {
		newProps.onClick = onClick
	}

	return (
		<Component { ...newProps }>
			{ icon || loading && (
				<span className="fluid-button-icon">{ true === loading ? <Icon.Loading /> : icon }</span>
			) }
			{ children }
		</Component>
	)
} )

export default Button
