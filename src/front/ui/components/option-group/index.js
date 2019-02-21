import React, { Fragment } from 'react'
import classname from 'classnames'
import { Button, Heading } from 'components'
import './style.scss'

export const OptionGroup = props => {
    const { className, title, children } = props
    const classes = classname({
        'fl-asst-option-group' : true
    }, className )
    return (
        <div className={classes}>
            { title && <Heading level={3}>{title}</Heading> }
            <ul>{children}</ul>
        </div>
    )
}

export const OptionGroupItem = props => {
    const { className, onClick, children, isSelected } = props
    const classes = classname({
        'fl-asst-option-group-item' : true
    }, className )
    const mergedProps = Object.assign({}, props, {
        className: classes,
    })
    delete mergedProps.onClick
    delete mergedProps.isSelected
    return (
        <li {...mergedProps}>
            <Button onClick={onClick} appearance="transparent" isSelected={isSelected}>{children}</Button>
        </li>
    )
}
