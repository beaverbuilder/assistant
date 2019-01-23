import React from 'react'
import './style.scss'

export const Widget = ({ children, title }) => {
    return (
        <div className="fl-asst-widget">
            { title && <div className="fl-asst-widget-title">{title}</div> }
            <div className="fl-asst-widget-contents">{children}</div>
        </div>
    )
}
