import React, { useState, createRef, createContext, useContext, useEffect } from 'fl-react'
import { __ } from '@wordpress/i18n'
import classname from 'classnames'
import { Flipped, Flipper } from 'react-flip-toolkit'
import { Icon } from 'shared-lib'
import './style.scss'

const transition = {
    stiffness: 500,
    damping: 30,
}

const adminBarSize = () => {
    const mobile = window.matchMedia('screen and (max-width: 782px)')
    if ( mobile.matches ) {
        return 46
    }
    return 32
}

export const WindowContext = createContext()
WindowContext.displayName = 'WindowContext'

export const Window = ({
        children,
        title,
        icon,
        size = 'mini',
        isHidden = false,
        shouldShowLabels = true,
        position = [0, 0],
        onChange = () => {},
        ...rest
    }) => {

    const handleChange = config => {
        const state = {
            isHidden,
            size,
            origin: position,
        }
        onChange({ ...state, ...config })
    }

    // Is Hidden
    const toggleIsHidden = () => {
        handleChange({ isHidden: !isHidden })
        requestAnimate()
    }

    // Size
    const toggleSize = () => {
        handleChange({
            size: 'mini' === size ? 'normal' : 'mini'
        })
        requestAnimate()
    }

    // Origin
    const setPosition = pos => {
        handleChange({
            origin: pos,
        })
    }

	// Animation
	const shouldAnimate = true
    const [ needsAnimate, setNeedsAnimate ] = useState( 0 )
	const requestAnimate = () => {
        if ( shouldAnimate ) {
            setNeedsAnimate( needsAnimate + 1 )
        }
    }

    const context = {
        isHidden,
        toggleIsHidden,

        size,
        toggleSize,

        position,
        setPosition,

        requestAnimate,
        shouldShowLabels,
    }
    return (
        <Flipper flipKey={needsAnimate}>
            <WindowContext.Provider value={context}>
                <WindowLayer onChange={handleChange} {...rest}>
                    { !isHidden && <MiniPanel title={title}>{children}</MiniPanel> }
                    { isHidden && <WindowButton title={title}>{icon}</WindowButton> }
                </WindowLayer>
            </WindowContext.Provider>
        </Flipper>
    )
}

const WindowLayer = ({
        className,
        children,
        onChange = () => {},
        ...rest
    }) => {
    const { requestAnimate, size, isHidden, position, setPosition } = useContext( WindowContext )
    const ref = createRef()

    // Window Movement
    const [isDragging, setIsDragging] = useState( false )
    const [initialPos, setInitialPos] = useState( { x: null, y: null } )
    const [currentPos, setCurrentPos] = useState( { x: null, y: null } )
    const [offset, setOffset] = useState( { x: 0, y: 0 } )

    const dragStart = e => {

        if ( "touchstart" === e.type ) {
            setInitialPos({
                x: e.nativeEvent.touches[0].clientX - offset.x,
                y: e.nativeEvent.touches[0].clientY - offset.y
            })
        } else {
            setInitialPos({
                x: e.nativeEvent.clientX - offset.x,
                y: e.nativeEvent.clientY - offset.y
            })
        }

        if ( e.target.classList.contains('fl-asst-window-drag-handle') ) {
            setIsDragging( true )
        }
    }

    const drag = e => {
        if ( isDragging ) {
            e.preventDefault()

            if ( "touchmove" === e.type ) {
                setCurrentPos({
                    x: e.nativeEvent.touches[0].clientX - initialPos.x,
                    y: e.nativeEvent.touches[0].clientY - initialPos.y,
                })
            } else {
                setCurrentPos({
                    x: e.nativeEvent.clientX - initialPos.x,
                    y: e.nativeEvent.clientY - initialPos.y,
                })
            }
            setOffset( Object.assign({}, currentPos ) )
        }
    }

    const dragEnd = e => {
        if ( ! e.currentTarget || !isDragging ) return false

        let point = e.nativeEvent
        if ( "touchend" === e.type ) {
            point = e.nativeEvent.changedTouches[0]
        }
        const x = point.clientX > ( ref.current.clientWidth / 2 ) ? 1 : 0
        const y = point.clientY > ( ref.current.clientHeight / 2 ) ? 1 : 0

        const reset = { x: 0 , y: 0 }
        setInitialPos( reset )
        setCurrentPos( reset )
        setOffset( reset )
        setIsDragging( false )

        setPosition([x,y])
        onChange({ origin: [x,y] })
        requestAnimate()
        return false
    }

    const classes = classname({
        'fl-asst-window-layer' : true,
        'fl-asst-window-layer-is-dragging' : isDragging,
    }, className )

    // Layer Props
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

    // Positioner
    const { x: xPos, y: yPos } = currentPos
    const transform = isDragging ? "translate3d(" + xPos + "px, " + yPos + "px, 0)" : ""
    const [windowX, windowY] = position
    const pad = 15

    let positionerStyles = {
        position: 'absolute',
        top: windowY ? 'auto' : adminBarSize() + pad,
        bottom: windowY ? pad : 'auto',
        right: windowX ? pad : 'auto',
        left: windowX ? 'auto' : pad,
        willChange: 'transform',
        transform,
    }
    if ( 'normal' === size && !isHidden ) {
        positionerStyles = {
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: windowX ? 0 : 'auto',
            left: windowX ? 'auto' : 0,
            transform,
        }
    }

    return (
        <div {...props}>
            <div className="fl-asst-window-positioner" style={positionerStyles}>{children}</div>
        </div>
    )
}

const MiniPanel = ({ className, children, title, ...rest }) => {
    const { toggleIsHidden, toggleSize, size, shouldShowLabels } = useContext( WindowContext )
    const classes = classname({
        'fl-asst-window' : true,
        [`fl-asst-window-${size}`] : size,
        'fl-asst-surface' : true,
        'fl-asst-rounded' : 'normal' !== size,
    }, className )

    const stopProp = e => e.stopPropagation()

    const stopEvts = {
        onMouseMove: stopProp,
        onTouchStart: stopProp,
    }

    return (
        <Flipped flipId="window" spring={transition}>
            <div className={classes} {...rest}>
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div className="fl-asst-window-toolbar fl-asst-window-drag-handle">
                        <span className="fl-asst-window-drag-handle" style={{ display: 'inline-flex' }}>
                            <Icon.DragHandle />
                            { shouldShowLabels && <ButtonLabel>{__('Move')}</ButtonLabel> }
                        </span>
                        {title}
                        <span
                            {...stopEvts}
                            style={{ marginLeft: 'auto' }}
                        >
                            <button onClick={toggleSize}>
                                { 'mini' === size && <Icon.Expand /> }
                                { 'normal' === size && <Icon.Collapse /> }
                                { shouldShowLabels && <ButtonLabel>{
                                    'mini' === size ?
                                    __('Expand') : __('Compact')
                                }</ButtonLabel> }
                            </button>
                            <button onClick={toggleIsHidden}>
                                <Icon.Close />
                                { shouldShowLabels && <ButtonLabel>{__('Hide')}</ButtonLabel> }
                            </button>
                        </span>
                    </div>
                    <div
                        className="fl-asst-window-content fl-asst-window-move-handle"
                        {...stopEvts}
                    >{children}</div>
                </div>
            </div>
        </Flipped>
    )
}

export const WindowButton = ({ children, title, ...rest }) => {
    const { toggleIsHidden } = useContext( WindowContext )
    return (
        <Flipped flipId="window" spring={transition}>
            <button className="fl-asst-window-button fl-asst-surface fl-asst-window-drag-handle" onClick={toggleIsHidden} {...rest}>
                <Flipped inverseFlipId="window">{children}</Flipped>
            </button>
        </Flipped>
    )
}

const ButtonLabel = ({ className, ...rest }) => {
    const classes = classname('fl-asst-button-label', className )
    return <span className={classes} {...rest} />
}
