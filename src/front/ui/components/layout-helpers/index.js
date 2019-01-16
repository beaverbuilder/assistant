import React from 'react'
import classname from 'classnames'
import './style.scss'

export const HorizontalGroup = ({ className, children }) => {
    const classes = classname({
        'fl-asst-hgroup': true
    }, className )
    return (
        <div className={classes}>{children}</div>
    )
}

export const VerticalGroup = ({ className, children }) => {
    const classes = classname({
        'fl-asst-vgroup': true
    }, className )
    return (
        <div className={classes}>{children}</div>
    )
}

export const Padding = ({ className, children }) => {
    const classes = classname({
        'fl-asst-padding-normal': true
    }, className )
    return (
        <div className={classes}>{children}</div>
    )
}

export const Separator = props => {
    const classes = classname({
        'fl-asst-separator' : true
    })
    return <hr className={classes} />
}
