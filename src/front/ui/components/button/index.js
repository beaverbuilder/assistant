import React, { Fragment, forwardRef, createRef, useEffect, useState } from 'react'
import { animated, useSpring } from 'react-spring'
import classname from 'classnames'
import { useSystemState } from 'store'
import { useAppFrame } from 'system'
import { useWindowSize } from 'utils/window'
import { useHover } from 'use-events'
import './style.scss'

export const Button = forwardRef( ( props, ref ) => {
	const { children, isSelected, className, appearance } = props
	const classes = classname( {
		'fl-asst-button': true,
		'fl-asst-button-is-selected': isSelected,
		'fl-asst-button-transparent': 'icon' === appearance || 'transparent' === appearance,
		'fl-asst-button-icon': 'icon' === appearance
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


export const AppTabButton = props => {
	const ref = createRef()
	const [ tooltipPos, setTooltipPos ] = useState( { x: 0, y: 0, width: 0 } )
	const { shouldReduceMotion } = useSystemState()
	const { appFrame: { sizeName } } = useAppFrame()
	const { width } = useWindowSize()
	const [ isHovering, hoverEvents ] = useHover()
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
		...hoverEvents,
		ref,
	}

	useEffect( () => {
		if ( ref.current ) {
			const el = ref.current
			setTooltipPos( {
				x: el.offsetLeft + ( el.offsetWidth / 2 ),
				y: el.offsetTop + el.offsetHeight,
				width: el.offsetWidth,
			} )
		}
	}, [] )

	return (
		<Fragment>
			<animated.button {...merged} />
			<AppTooltip
				position={tooltipPos}
				isAppSelected={isSelected}
				isShowing={isHovering}
			>{tooltip}</AppTooltip>
		</Fragment>
	)
}

const AppTooltip = props => {
	const {
		children,
		position: { x, y, width: btnWidth },
		isShowing,
		isAppSelected,
	} = props
	const ref = createRef()
	const [ width, setWidth ] = useState( 0 )

	useEffect( () => {
		if ( ref.current ) {
			setWidth( ref.current.offsetWidth )
		}
	}, [] )

	const classes = classname( {
		'fl-asst-tooltip': true,
		'fl-asst-tooltip-highlighted' : isAppSelected,
	} )

	let left = x - ( width / 2 )
	if ( 0 > left ) {
		left = x - ( btnWidth / 2 )
	}

	const styles = {
		top: y + 4,
		left,
		visibility: isShowing ? 'visible' : 'hidden'
	}

	return (
		<div className={classes} style={styles} ref={ref}>{children}</div>
	)
}
