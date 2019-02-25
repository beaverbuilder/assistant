import React from 'react'
import classname from 'classnames'
import { Frame } from 'components'
import './style.scss'

export const SplitView = props => {
	const { className } = props
	const classes = classname( {
		'fl-asst-split-view': true,
	}, className )

	const merged = Object.assign( {}, props, {
		className: classes,
	} )

	return (
		<div {...merged} />
	)
}

SplitView.Master = props => {
	const { className } = props
	const classes = classname( {
		'fl-asst-split-view-master': true,
	}, className )

	const merged = Object.assign( {}, props, {
		className: classes,
		style: {
			flex: '0 0 300px'
		}
	} )

	return (
		<Frame {...merged} />
	)
}

SplitView.Detail = props => {
	const { className } = props
	const classes = classname( {
		'fl-asst-split-view-detail': true,
	}, className )

	const merged = Object.assign( {}, props, {
		className: classes,
	} )

	return (
		<Frame {...merged} />
	)
}
