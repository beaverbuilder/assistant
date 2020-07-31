import React, { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import c from 'classnames'
import camelcase from 'camelcase'
import * as Icon from '../../icon'

const appearances = [ 'normal', 'transparent', 'elevator' ]
const sizes = [ 'sm', 'med', 'lg' ]
const shapes = [ 'round' ]

const capitalize = value => value.charAt( 0 ).toUpperCase() + value.slice( 1 )

const matchIcon = value => {
	if ( 'string' === typeof value ) {
		const name = capitalize( camelcase( value ) )
		if ( Object.keys( Icon ).includes( name ) ) {
			const FoundIcon = Icon[name]
			return <FoundIcon />
		}
	}
	return value
}

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
		size,
		shape,
		isLoading = false,
		disabled,
		children,
		...rest
	} = props

	const classes = c( 'fluid-button', {
		'is-selected': isSelected,
		[`fluid-status-${status}`]: status,
		[`fluid-size-${size}`]: sizes.includes( size ),
		[`fluid-appearance-${appearance}`]: appearances.includes( appearance ),
		[`fluid-shape-${shape}`]: shape && shapes.includes( shape )
	}, className )

	let newProps = {
		ref,
		className: classes,
		role: 'button',
		disabled: disabled || isLoading,
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
			{ ( icon || isLoading ) && (
				<span className="fluid-button-icon">
					{ true === isLoading ? <Icon.Loading /> : matchIcon( icon ) }
				</span>
			) }
			{ children && <span>{ children }</span> }
		</Component>
	)
} )

export default Button
