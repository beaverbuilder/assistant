import React from 'react'
import classname from 'classnames'
import './style.scss'

export const Widget = ({ children, title, isPadded }) => {
    const classes = classname({
        'fl-asst-widget' : true,
        'fl-asst-widget-no-padding' : isPadded === false ? true : false
    })
    return (
        <div className={classes}>
            { title && <div className="fl-asst-widget-title">{title}</div> }
            <div className="fl-asst-widget-contents">{children}</div>
        </div>
    )
}
