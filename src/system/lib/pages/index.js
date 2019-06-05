import React from 'fl-react'
import classname from 'classnames'
import './style.scss'

export const Page = ({ className, ...rest }) => {
    const classes = classname({
        'fl-asst-page' : true,
    }, className )
    return (
        <div className={classes} {...rest} />
    )
}
