import React from 'react'
import classname from 'classnames'

export const AppTabButton = props => {
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

	const merged = {
		onClick,
		children,
		className: classes,
		type: 'button',
		title: tooltip,
	}

	return <button {...merged} />
}
