import React, { createElement, forwardRef } from 'react'
import classname from 'classnames'
import { Icon } from 'components'
import './style.scss'

export const Button = forwardRef( ( props, ref ) => {
	const { isSelected, className, appearance, rel } = props
	const classes = classname( {
		'fl-asst-button': true,
		'fl-asst-button-is-selected': isSelected,
		'fl-asst-button-transparent': 'icon' === appearance || 'transparent' === appearance,
		'fl-asst-button-icon': 'icon' === appearance,
		[`fl-asst-button-${appearance}`]: appearance,
	}, className )

	const filteredProps = Object.assign( {}, props, {
		ref,
		className: classes,
		type: 'button',
		appearance: undefined,
	} )
	delete filteredProps.appearance
	delete filteredProps.isSelected

	if ( props.href ) {
		delete filteredProps.type
	}

	if ( props.href && '_blank' === props.target && !rel ) {
		filteredProps.rel = 'noopener noreferrer'
	}

	return createElement(
		props.href ? 'a' : 'button',
		filteredProps
	)
} )

export const NewButton = forwardRef( ( props, ref ) => {
	return (
		<Button {...props} appearance="round" ref={ref}>
			<Icon name="plus"/>
		</Button>
	)
} )
