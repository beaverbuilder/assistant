import React from 'fl-react'
import classnames from 'classnames'
import './panel.scss'


export const Panel = (props) => {
    const classes = classnames(
        'fl-asst-panel',
        props.className
    )

    return (
        <div className={classes}>
            {props.children}
        </div>
    )
}
