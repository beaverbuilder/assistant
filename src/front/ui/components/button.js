import React, { forwardRef, useContext } from 'react'
import posed from 'react-pose'
import { animated, useSpring } from 'react-spring'
import classname from 'classnames'
import { useStore } from 'store'
import { UIContext } from 'components'

export const Button = forwardRef( ( props, ref ) => {
	const { children, isSelected, className, appearance } = props
	const classes = classname( {
		'fl-asst-button': true,
		'fl-asst-button-is-selected': isSelected,
		'fl-asst-button-transparent': 'icon' === appearance || 'transparent' === appearance,
		'fl-asst-button-icon' : 'icon' === appearance
	}, className )

	const filteredProps = Object.assign( {}, props, {
		ref,
		className: classes,
		type: 'button',
		appearance: undefined,
	} )
	delete filteredProps.appearance
	delete filteredProps.isSelected

	return (
		<button {...filteredProps}>{children}</button>
	)
} )


export const AppTabButton = forwardRef( ( props, ref ) => {
	const { shouldReduceMotion } = useStore()
	const { appFrameSize } = useContext( UIContext )
	const { children, isSelected, onClick, className, tooltip } = props
	const classes = classname( {
		'fl-asst-button': true,
		'fl-asst-app-tab-button': true,
		'fl-asst-button-is-selected': isSelected
	}, className )

	const isFrameExpanded = ['full', 'wide'].includes( appFrameSize )

	const springProps = useSpring({
		paddingLeft: isFrameExpanded ? 20 : 10,
		paddingRight: isFrameExpanded ? 20 : 10,
		immediate: shouldReduceMotion,
	})

	const merged = {
		ref,
		onClick,
		children,
		className: classes,
		type: 'button',
		title: tooltip,
		style: springProps
	}

	return (
		<animated.button {...merged} />
	)
} )
