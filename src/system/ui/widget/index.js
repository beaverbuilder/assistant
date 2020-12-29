import React from 'react'
import c from 'classnames'
import WidgetLayout from './layout'
import WidgetLibrary from './library'
import './style.scss'

const Widget = ( { title, children, size, type, className, showTitle = false, ...rest } ) => {
	return (
		<div
			className={ c( 'fluid-widget', {
				[`fluid-widget-size-${size}`]: size,
				[`fluid-widget-type-${type}`]: type,
				[`fl-asst-widget-type-${type}`]: type,
			}, className ) }
			{ ...rest }
		>
			{ showTitle && <div className="fluid-widget-title">{title}</div> }
			<div className="fluid-widget-content">{children}</div>
		</div>
	)
}

Widget.Layout = WidgetLayout
Widget.Library = WidgetLibrary

export default Widget
