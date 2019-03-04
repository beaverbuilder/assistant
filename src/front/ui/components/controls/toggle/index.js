import React, { useState } from 'react'
import { animated, useSpring, config } from 'react-spring'
import classname from 'classnames'
import { useSystemState } from 'store'
import './style.scss'

export const ToggleControl = props => {
	const {
		className,
		value: initialValue = false,
		onChange = () => () => {},
	} = props
	const [ value, setValue ] = useState( initialValue )
	const { shouldReduceMotion } = useSystemState()

	const classes = classname( {
		'fl-asst-button': true,
		'fl-asst-control-toggle': true,
	}, className )

	const mergedProps = Object.assign( {}, props, {
		className: classes,
		type: 'button',
		onClick: e => {
			setValue( ! value )
			onChange( ! value, e )
		},
	} )

	const thumbProps = useSpring( {
		transform: value ? 'translateX(30px)' : 'translateX(0px)',
		background: value ? 'var(--fl-accent-color)' : 'transparent',
		borderColor: value ? 'transparent' : '',
		config: {
			...config.default,
			tension: 700,
			friction: 25,
		},
		immediate: shouldReduceMotion
	} )

	return (
		<button {...mergedProps}>
			<animated.div className="fl-asst-control-thumb" style={thumbProps} />
		</button>
	)
}
