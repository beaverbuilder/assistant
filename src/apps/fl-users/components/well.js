import React from 'fl-react'
import classnames from 'classnames'
import './well.scss'

export const Well = (props) => {

    const classes = classnames(
        'fl-asst-well',
        props.className
    )
    return (
        <div className={classes}>
            { props.children }
        </div>
    )
}
