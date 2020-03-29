import React from 'react'
import classname from 'classnames'
import Layout from '../'

const Row = ({
    className,
    align = 'center',
    style,
    padX = false,
    padY = false,
    gap = 0,
    direction,
    ...rest
}) => {

    const formatGap = val => {

        if ( Number.isInteger( val ) && 0 !== val ) {
            return val + 'px'
        }
        if ( 'lg' === val || 'large' === val ) {
            return 'var(--fluid-lg-space)'
        }
        if ( 'med' === val || 'medium' === val ) {
            return 'var(--fluid-med-space)'
        }
        if ( 'sm' === val || 'small' === val ) {
            return 'var(--fluid-med-space)'
        }
        return val
    }

    const formatAlign = val => {

        if ( 'left' === val ) return 'flex-start'
        if ( 'right' === val ) return 'flex-end'

        return val
    }

    const formatDirection = val => {
        if ( 'reverse' === val ) {
            return 'row-reverse'
        }
        return val
    }

    const styles = {
        justifyContent: formatAlign( align ),
        '--fluid-gap': formatGap( gap ),
        flexDirection: formatDirection( direction ),
        ...style,
    }

    const classes = classname( 'fluid-row', className )

    return (
        <Layout.Box
            padX={padX}
            padY={padY}
            className={ classes }
            style={styles}
            {...rest}
        />
    )
}

export default Row
