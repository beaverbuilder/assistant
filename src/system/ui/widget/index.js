import React from 'react'
import './style.scss'

const Widget = ( { title, children } ) => {

	return (
		<div className="fluid-widget">
			{ title && <div className="fluid-widget-title">{title}</div> }
			<div className="fluid-widget-content">{children}</div>
		</div>
	)
}

export default Widget
