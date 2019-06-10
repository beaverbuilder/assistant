import React from 'fl-react'
import { __ } from 'assistant'
import { Docs as DocPages } from './pages'

export const Docs = ( { windowMargin = 0, align = 'left' } ) => {

	let style = {
		position: 'fixed',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		zIndex: 99,
		overflow: 'auto',
	}
	if ( 'left' === align ) {
		style.paddingRight = windowMargin
	} else {
		style.paddingLeft = windowMargin
	}

	const contentStyle = {
		maxWidth: '120ch',
		padding: 60,
		margin: 'auto',
	}

	return (
		<div style={style} className="fl-asst-surface">
			<div style={contentStyle}>
				<h1>{__('Design Docs')}</h1>
				<DocPages />
			</div>
		</div>
	)
}
