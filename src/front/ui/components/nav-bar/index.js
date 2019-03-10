import React, { Children, useState, cloneElement } from 'react'
import { animated, useSpring } from 'react-spring'
import classname from 'classnames'
import { Button } from 'components'
import { useSystemState } from 'store'
import './style.scss'

export const NavBar = props => {
	const {
		children,
		className,
		isExpanded: initialExpanded = false,
		onChange = () => {},
	} = props
	const { shouldReduceMotion } = useSystemState()

	const [ isExpanded, setIsExpanded ] = useState( initialExpanded )
	const classes = classname( {
		'fl-asst-nav-bar': true,
		'fl-asst-nav-bar-is-expanded': isExpanded,
	}, className )

	const collapsedHeight = 145
	const expandedHeight = 558
	const style = useSpring({
		height: isExpanded ? expandedHeight : collapsedHeight,
		immediate: shouldReduceMotion,
	})

	const merged = {
		...props,
		className: classes,
		style,
	}
	delete merged.isExpanded

	const toggle = () => {
		setIsExpanded( ! isExpanded )
		onChange( ! isExpanded )
	}

	const contents = Children.map( children, ( item, i ) => {
		if ( item.type === Expanded || item.type === Collapsed ) {
			return cloneElement( item, { ...item.props, isExpanded } )
		}
	})

	return (
		<animated.div {...merged}>
			{contents}
			<div className="fl-asst-nav-bar-footer">
				<MoreButton onClick={toggle} isExpanded={isExpanded} />
			</div>
		</animated.div>
	)
}

const Expanded = props => {
	const { className, isExpanded } = props
	const { shouldReduceMotion } = useSystemState()
	const classes = classname( {
		'fl-asst-nav-bar-content': true,
		'fl-asst-nav-bar-content-expanded': true,
	}, className )

	const style = useSpring({
		transform: isExpanded ? 'translateY(0px)' : 'translateY(145px)',
		opacity: isExpanded ? 1 : 0,
		immediate: shouldReduceMotion,
	})

	const merged = {
		...props,
		className: classes,
		style
	}
	delete merged.isExpanded

	return (
		<animated.div {...merged} />
	)
}

const Collapsed = props => {
	const { className, isExpanded } = props
	const { shouldReduceMotion } = useSystemState()
	const classes = classname( {
		'fl-asst-nav-bar-content': true,
		'fl-asst-nav-bar-content-collapsed': true,
	}, className )

	const style = useSpring({
		transform: isExpanded ? 'translateY(-100%)' : 'translateY(0%)',
		opacity: isExpanded ? 0 : 1,
		immediate: shouldReduceMotion,
	})

	const merged = {
		...props,
		className: classes,
		style,
	}
	delete merged.isExpanded

	return (
		<animated.div {...merged} />
	)
}

const MoreButton = props => {
	const { isExpanded } = props
	const line = '2,4 25,4 48,4'
	const up = '5,6 25,2 45,6'

	const merged = { ...props}
	delete merged.isExpanded

	return (
		<Button {...merged} appearance="transparent">
			<svg className="fl-asst-icon" width="50px" height="8px" viewBox="0 0 50 8">
				<g
					fill="transparent"
					fillRule="nonzero"
					stroke="currentColor"
					strokeWidth="4"
					strokeLinecap="round"
				>
					<polyline points={ isExpanded ? up : line } />
				</g>
			</svg>
		</Button>
	)
}

NavBar.Expanded = Expanded
NavBar.Collapsed = Collapsed
