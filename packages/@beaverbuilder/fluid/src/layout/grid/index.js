import React from 'react'
import c from 'classnames'

const Grid = ({
    tag: Tag = 'div',
    className,
    ...rest
}) => {
    const classes = c( 'fluid-layout-grid', className )
    return (
        <Tag className={ classes } {...rest} />
    )
}

export default Grid
