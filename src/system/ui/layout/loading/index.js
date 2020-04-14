import React from 'react'
import classname from 'classnames'
import './style.scss'

const Loading = ({ className, ...rest }) => (
    <div className={ classname( "fl-asst-loading-bar", className ) } {...rest}>
        <div className="fl-asst-load-dot"></div>
        <div className="fl-asst-load-dot"></div>
        <div className="fl-asst-load-dot"></div>
    </div>
)

export default Loading
