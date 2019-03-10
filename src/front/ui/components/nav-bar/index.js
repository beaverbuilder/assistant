import React, { Children, useState } from 'react'
import classname from 'classnames'
import { Button } from 'components'
import './style.scss'

export const NavBar = props => {
	const {
		children,
		className,
		isExpanded: initialExpanded = false,
		onChange = () => {},
	} = props

	const [ isExpanded, setIsExpanded ] = useState( initialExpanded )
	const classes = classname( {
		'fl-asst-nav-bar': true,
		'fl-asst-nav-bar-is-expanded': isExpanded,
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
	} )

	const toggle = () => {
		setIsExpanded( ! isExpanded )
		onChange( ! isExpanded )
	}

	return (
		<div {...merged}>
			{contents}
			<div className="fl-asst-nav-bar-footer">
				<MoreButton onClick={toggle} isExpanded={isExpanded} />
			</div>
		</div>
	)
}

const Expanded = props => {
	const { className } = props
	const classes = classname( {
		'fl-asst-nav-bar-content': true,
		'fl-asst-nav-bar-content-expanded': true,
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
	const { className } = props
	const classes = classname( {
		'fl-asst-nav-bar-content': true,
		'fl-asst-nav-bar-content-collapsed': true,
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
