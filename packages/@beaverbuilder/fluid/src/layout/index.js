import React from 'react'
import classname from 'classnames'
import Box from './box'
import AspectBox from './aspect-box'
import Row from './row'
import Loading from './loading'
import Message from './message'
import Split from './split'
import Toolbar from './toolbar'
import ContentBoundary from './content-boundary'
import DropArea from './drop-area'
import './style.scss'

// Headline
const Headline = ( { className, children, ...rest } ) => {
	const classes = classname( 'fluid-headline', className )
	return (
		<div className={ classes } role="heading" aria-level="2" { ...rest }>{children}</div>
	)
}

export {
	Box,
	Row,
	Loading,
	Headline,
	Message,
	AspectBox,
	Split,
	Toolbar,
	ContentBoundary,
	DropArea
}
