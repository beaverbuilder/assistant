import React from 'react'
import classname from 'classnames'

export const Button = props => {
    const { children, isSelected, onClick, className, style } = props
    const classes = classname({
        'fl-asst-button': true,
        'fl-asst-button-is-selected': isSelected
    }, className )
    return (
        <button className={classes} onClick={onClick} style={style}>{children}</button>
    )
}

export const AppTabButton = props => {
    const { children, isSelected, onClick, className } = props
    const classes = classname({
        'fl-asst-button': true,
        'fl-asst-app-tab-button': true,
        'fl-asst-button-is-selected': isSelected
    }, className )
    return (
        <button className={classes} onClick={onClick}>{children}</button>
    )
}
