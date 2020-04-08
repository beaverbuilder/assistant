import React from 'react'
import classname from 'classnames'
import { Notice as WPNotice } from '@wordpress/components'
import './style.scss'

const Notice = ({ className, ...rest }) => {

    const classes = classname('fl-asst-notice', className )

    return (
        <WPNotice
            className={classes}
            {...rest}
        />
    )
}

export default Notice
