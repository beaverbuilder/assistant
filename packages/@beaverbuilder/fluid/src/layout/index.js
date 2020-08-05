import React from 'react'
import c from 'classnames'
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
// @deprecated - this is going to get replaced with something on the Text API
const Headline = ( { className, ...rest } ) => (
	<div
		className={ c( 'fluid-headline', className ) }
		role="heading"
		aria-level="2"
		{ ...rest }
	/>
)

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
	DropArea,
}
