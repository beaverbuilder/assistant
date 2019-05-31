import React from 'react'
import classname from 'classnames'
import './style.scss'

export const ButtonLabel = ({ className, ...rest }) => {
    const classes = classname('fl-asst-button-label', className )
    return <span className={classes} {...rest} />
}
