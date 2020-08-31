import React from 'react'
import c from 'classnames'
import WidgetLayout from './layout'
import './style.scss'

const Widget = ( { title, children, size, type, className, ...rest } ) => {
	return (
		<div
			className={ c( 'fluid-widget', {
				[`fluid-widget-size-${size}`]: size,
				[`fluid-widget-type-${type}`]: type,
			}, className ) }
			{ ...rest }
		>
			<div className="fluid-widget-title">{title}</div>
			<div className="fluid-widget-content">{children}</div>
		</div>
	)
}

Widget.Layout = WidgetLayout

export default Widget
