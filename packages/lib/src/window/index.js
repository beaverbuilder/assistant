import React, { useState, createRef } from 'react'
import classname from 'classnames'
import { Flipped } from 'react-flip-toolkit'
import './style.scss'

const transition = {
    stiffness: 700,
    damping: 50,
}

export const Window = ({ children, ...rest }) => {
    return (
        <WindowLayer {...rest}>
            <MiniPanel>{children}</MiniPanel>
        </WindowLayer>
    )
}

const WindowLayer = ({ className, children, requestAnimate, ...rest }) => {
    const ref = createRef()
    const [windowPosition, setWindowPosition] = useState( [1,1] )
    const [isDragging, setIsDragging] = useState( false )
    const [initialPos, setInitialPos] = useState( { x: null, y: null } )
    const [currentPos, setCurrentPos] = useState( { x: null, y: null } )
    const [offset, setOffset] = useState( { x: 0, y: 0 } )

    const dragStart = e => {

        if (e.type === "touchstart") {
            setInitialPos({
                x: e.touches[0].clientX - offset.x,
                y: e.touches[0].clientY - offset.y
            })
        } else {
            setInitialPos({
                x: e.clientX - offset.x,
                y: e.clientY - offset.y
            })
        }
        setIsDragging( true )
    }

    const drag = e => {
        if ( isDragging ) {

            e.preventDefault()

            if ( e.type === "touchmove" ) {
                setCurrentPos({
                    x: e.touches[0].clientX - initialPos.x,
                    y: e.touches[0].clientX - initialPos.y,
                })
            } else {
                setCurrentPos({
                    x: e.clientX - initialPos.x,
                    y: e.clientY - initialPos.y,
                })
            }
            setOffset( Object.assign({}, currentPos ) )
        }
    }

    const dragEnd = e => {
        const x = e.clientX > ( ref.current.clientWidth / 2 ) ? 1 : 0
        const y = e.clientY > ( ref.current.clientHeight / 2 ) ? 1 : 0

        const reset = { x: 0 , y: 0 }
        setInitialPos( reset )
        setCurrentPos( reset )
        setOffset( reset )
        setIsDragging( false )
        setWindowPosition([x,y])
        requestAnimate()
    }

    const classes = classname({
        'fl-asst-window-layer' : true,
        'fl-asst-window-layer-is-dragging' : isDragging,
    }, className )

    const props = {
        ...rest,
        ref,
        className: classes,

        onTouchStart: dragStart,
        onTouchEnd: dragEnd,
        onTouchMove: drag,
        onMouseDown: dragStart,
        onMouseUp: dragEnd,
        onMouseMove: drag,
    }

    const { x: xPos, y: yPos } = currentPos
    const transform = isDragging ? "translate3d(" + xPos + "px, " + yPos + "px, 0)" : ""

    const [windowX, windowY] = windowPosition
    const toolbar = 32
    const pad = 15
    const positionerStyles = {
        position: 'absolute',
        top: windowY ? 'auto' : toolbar + pad,
        bottom: windowY ? pad : 'auto',
        right: windowX ? pad : 'auto',
        left: windowX ? 'auto' : pad,
        transform,
    }

    return (
        <div {...props}>
            { isDragging && <WindowDropZones /> }
            <div style={positionerStyles}>{children}</div>
        </div>
    )
}

const MiniPanel = ({ className, children, ...rest }) => {
    const classes = classname({
        'fl-asst-window' : true,
        'fl-asst-mini-window' : true,
    }, className )
    return (
        <Flipped flipId="window" spring={transition} translate>
            <div className={classes} {...rest}>
                <div className="fl-asst-window-toolbar">Window</div>
                <div className="fl-asst-window-content fl-asst-window-move-handle" onMouseDown={ e => e.stopPropagation() }>{children}</div>
            </div>
        </Flipped>
    )
}

const WindowDropZones = ({ ...rest }) => {
    return (
        <div className="fl-asst-window-drop-zones" {...rest}>
            <div className="fl-asst-window-drop-zones-top-bar" />
            <div className="fl-asst-window-drop-zone-area">
                <DropZone />
                <DropZone />
                <DropZone />
                <DropZone />
            </div>
        </div>
    )
}

const DropZone = () => {
    const classes = classname({
        'fl-asst-window-drop-zone' : true
    })
    return (
        <div className={classes} />
    )
}

export const WindowButton = ({ onClick }) => {
    return (
        <Flipped flipId="window" spring={transition}>
            <button className="fl-asst-window-button" onClick={onClick}>
                <Flipped inverseFlipId="window">
                    <div>Icon</div>
                </Flipped>
            </button>
        </Flipped>
    )
}
