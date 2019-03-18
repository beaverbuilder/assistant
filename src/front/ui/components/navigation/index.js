import React from 'react'
import classname from 'classnames'
import { Button, Icon } from 'components'
import './style.scss'

export const NavBar = props => {
	const { className, items = [], maxItems = null } = props

	const classes = classname( {
		'fl-asst-nav-bar': true,
	}, className )

	const merged = {
		...props,
		className: classes,
	}
	delete merged.items
	delete merged.maxItems

	return (
		<nav {...merged}>
			{ items.map( ( item, i ) => {

				if ( maxItems && i >= maxItems ) {
					return null
				}

				return (
					<Button key={i} {...item} />
				)
			} )}
			{ false && <MoreButton /> }
		</nav>
	)
}

const MoreButton = () => {
	return (
		<Button className="fl-asst-nav-bar-more-button">
			<Icon name="more" />
		</Button>
	)
}
