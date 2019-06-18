import React, { forwardRef } from 'fl-react'
import { Link } from 'fl-react-router-dom'
import classname from 'classnames'
import './style.scss'

export const Button = forwardRef( ( props, ref) => {
    const {
        className,
        to,
        href,
        onClick,
        ...rest
    } = props

    const classes = classname({
        'fl-asst-button' : true,
    }, className )

    let newProps = {
        ...rest,
        ref,
        className: classes,
    }

    // Determine the tag for this button based on props.
    let Tag = 'button'
    if ( to || href ) {
        // Routing Link
        Tag = 'a'
        if ( href ) {
            newProps.href = href
        } else {
            Tag = Link
            newProps.to = to
        }
    } else {
        newProps.onClick = onClick
    }

    return (
        <Tag {...newProps} />
    )
})

Button.Group = ({ children, className, direction = 'row', ...rest }) => {
    const classes = classname({
        'fl-asst-button-group': true,
        [`fl-asst-button-group-${direction}`] : direction,
    }, className )
    return (
        <div className={classes} role="group">{children}</div>
    )
}
