import React from 'react'
import c from 'classnames'

const Toolbar = ({ className, ...rest }) => (
    <div
        className={ c( 'fluid-toolbar', className ) }
        { ...rest }
    />
)

export default Toolbar
