import React, { useState } from 'react'
import c from 'classnames'
import { Icon, Button } from '../../'
import './style.scss'

const Pane = ({
    tag: Tag = 'div',
    className,
    children,
    size,
    style,
    ...rest
}) => {

    const width = Number.isInteger( size ) ? `${size}px` : size

    const styles = {
        ...style,
        flex: 'undefined' !== typeof width && `0 0 ${width}`
    }

    return (
        <Tag
            className={ c( 'fluid-split-pane', className ) }
            style={styles}
            {...rest}
        >
            {children}
        </Tag>
    )
}

const Split = ({
    tag: Tag = 'div',
    panes = [],
    sizes = [ 240 ],
    leading: Leading,
    showLeading,
    className,
    ...rest
}) => {
    const [showFirst, setShowFirst] = useState( true )
    const toggleFirstPane = () => setShowFirst( ! showFirst )

    const paneProps = {
        ...rest,
        toggleFirstPane,
        isFirstPaneHidden: ! showFirst
    }

    return (
        <Tag
            className={ c( 'fluid-split', className ) }
            {...rest}
        >

                { panes.length > 0 && panes.map( ( Content, i ) => {

                    // Allow hidding the first pane
                    if ( i === 0 && ! showFirst ) return null

                    return (
                        <Pane className="fluid-split-pane" key={i} size={sizes[i]}>
                            <Content {...paneProps} />
                        </Pane>
                    )
                })}
        </Tag>
    )
}

export default Split
