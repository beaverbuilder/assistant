import React, { Fragment, createRef } from 'react'
import { animated, useSpring } from 'react-spring'
import classname from 'classnames'
import { useSystemState } from 'store'
import { useAppFrame } from 'system'
import { useWindowSize } from 'utils/window'

export const AppTabButton = props => {
	const ref = createRef()
	const { shouldReduceMotion } = useSystemState()
	const { appFrame: { sizeName } } = useAppFrame()
	const { width } = useWindowSize()
	const {
		children,
		isSelected,
		onClick,
		className,
		tooltip,
	} = props

	const classes = classname( {
		'fl-asst-button': true,
		'fl-asst-app-tab-button': true,
		'fl-asst-button-is-selected': isSelected
	}, className )


	const isFrameExpanded = [ 'full', 'wide' ].includes( sizeName ) && 600 < width

	const springProps = useSpring( {
		paddingLeft: isFrameExpanded ? 20 : 10,
		paddingRight: isFrameExpanded ? 20 : 10,
		immediate: shouldReduceMotion,
	} )

	const merged = {
		onClick,
		children,
		className: classes,
		type: 'button',
		style: springProps,
		title: tooltip,
		ref,
	}

	return (
		<Fragment>
			<animated.button {...merged} />
		</Fragment>
	)
}
