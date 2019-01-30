import React from 'react'
import classname from 'classnames'
import './style.scss'

export const Stack = ({ children }) => {
    const classes = classname({
        'fl-asst-view-stack' : true,
    })
    return (
        <div className={classes}>{children}</div>
    )
}
