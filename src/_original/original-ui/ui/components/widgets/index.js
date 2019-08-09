import React from 'react'
import classname from 'classnames'
import { Heading } from 'components'
import './style.scss'

export const Widget = ( { children, title, isPadded, className, style, contentStyle } ) => {
	const classes = classname( {
		'fl-asst-widget': true,
		'fl-asst-widget-no-padding': false === isPadded ? true : false
	}, className )
	return (
		<div className={ classes } style={ style }>
			{ title && <Heading className="fl-asst-widget-title">{title}</Heading> }
			<div className="fl-asst-widget-contents" style={ contentStyle }>{children}</div>
		</div>
	)
}
