import React from 'react'
import classname from 'classnames'
import './style.scss'

const Loading = ( { className, ...rest } ) => (
	<div className={ classname( 'fluid-loading-bar', className ) } { ...rest }>
		<div className="fluid-dot"></div>
		<div className="fluid-dot"></div>
		<div className="fluid-dot"></div>
	</div>
)

export default Loading
