import React, { Children, useState } from 'react'
import classname from 'classnames'
import { Button } from 'components'
import './style.scss'

export const NavBar = props => {
	const {
		children,
		className,
		isExpanded: initialExpanded = false,
		style,
		onChange = () => {},
	} = props

	const [ isExpanded, setIsExpanded ] = useState( initialExpanded )
	const classes = classname( {
		'fl-asst-nav-bar': true,
		'fl-asst-nav-bar-is-expanded' : isExpanded,
	}, className )

	const merged = {
		...props,
		className: classes,
	}
	delete merged.isExpanded

	const contents = Children.map( children, item => {
		if ( item.type === Expanded && ! isExpanded ) {
			return null
		} else if ( item.type === Collapsed && isExpanded ) {
			return null
		}
		return item
	})

	const toggle = () => {
		setIsExpanded( ! isExpanded )
		onChange( ! isExpanded )
	}

	return (
		<div {...merged}>
			{contents}
			<div className="fl-asst-nav-bar-footer">
				<MoreButton onClick={toggle} />
			</div>
		</div>
	)
}

const Expanded = props => {
	const { children, className } = props
	const classes = classname({
		'fl-asst-nav-bar-content' : true,
		'fl-asst-nav-bar-content-expanded' : true,
	}, className )

	const merged = {
		...props,
		className: classes,
	}

	return (
		<div {...merged} />
	)
}

const Collapsed = props => {
	const { children, className } = props
	const classes = classname({
		'fl-asst-nav-bar-content' : true,
		'fl-asst-nav-bar-content-collapsed' : true,
	}, className )

	const merged = {
		...props,
		className: classes,
	}

	return (
		<div {...merged} />
	)
}

const MoreButton = props => {
	return (
		<Button {...props} appearance="transparent">
			<svg className="fl-asst-icon" width="50px" height="8px" viewBox="0 0 50 8">
				<g
					fill="transparent"
					fillRule="nonzero"
					stroke="currentColor"
					strokeWidth="4"
					strokeLinecap="round"
				>
					<polyline points="2,4 25,4 48,4" />
				</g>
			</svg>
		</Button>
	)
}

NavBar.Expanded = Expanded
NavBar.Collapsed = Collapsed
