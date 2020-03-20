import React, { useState, useEffect, createRef, createContext, useContext } from 'react'
import classname from 'classnames'
import { Flipped, Flipper } from 'react-flip-toolkit'
import { getSystemConfig, useSystemState } from 'data'
import './style.scss'

const transition = {
	stiffness: 500,
	damping: 30,
}

const adminBarSize = () => {
	const mobile = window.matchMedia( 'screen and (max-width: 782px)' )
	const { isShowingAdminBar, isAdmin } = getSystemConfig()

	if ( ! isShowingAdminBar && ! isAdmin ) {
		return 0
	}

	if ( mobile.matches ) {
		return 46
	}
	return 32
}

export const Window = ( {
	children,
	icon,
	size = 'mini',
	isHidden = false,
	shouldShowLabels = true,
	shouldDisplayButton = true,
	position = [ 1, 1 ],
	onChange = () => {},
	toolbar: topbar,
	...rest
} ) => {

	const { overlayToolbar, shouldReduceMotion } = useSystemState()

	const handleChange = config => {
		const state = {
			isHidden,
			size,
			origin: position,
		}
		onChange( { ...state, ...config } )
	}

	// Is Hidden
	const toggleIsHidden = () => {
		handleChange( { isHidden: ! isHidden } )
		requestAnimate()
	}

	// Size
	const toggleSize = () => {
		handleChange( {
			size: 'mini' === size ? 'normal' : 'mini'
		} )
	}

	// Origin
	const setPosition = pos => {
		handleChange( { origin: pos } )
	}

	// Animation
	const [ needsAnimate, setNeedsAnimate ] = useState( 0 )
	const requestAnimate = () => {
		if ( ! shouldReduceMotion ) {
			setNeedsAnimate( needsAnimate + 1 )
		}
	}

	const context = {
		isHidden,
		toggleIsHidden,
		overlayToolbar,

		size,
		toggleSize,

		position,
		setPosition,

		requestAnimate,
		shouldShowLabels,
	}

	return (
		<Flipper flipKey={ needsAnimate }>
			<Window.Context.Provider value={ context }>
				<WindowLayer onChange={ handleChange } { ...rest }>
					{ ! isHidden && <WindowPanel topbar={ topbar }>{children}</WindowPanel> }
					{ isHidden && shouldDisplayButton && <WindowButton>{icon}</WindowButton> }
				</WindowLayer>
			</Window.Context.Provider>
		</Flipper>
	)
}

Window.defaults = {
	isHidden: false,
	size: 'mini',
	position: [ 1, 1 ],
	shouldShowLabels: true,
	overlayToolbar: false,
}

Window.Context = createContext( Window.defaults )
Window.Context.displayName = 'Window.Context'

const WindowLayer = ( {
	className,
	children,
	onChange = () => {},
	...rest
} ) => {
	const { requestAnimate, size, isHidden, position, setPosition } = useContext( Window.Context )
	const ref = createRef()
	const posRef = createRef()

	// Window Movement
	const [ isDragging, setIsDragging ] = useState( false )
	const [ initialPos, setInitialPos ] = useState( { x: null, y: null } )
	const [ currentPos, setCurrentPos ] = useState( { x: null, y: null } )
	const [ currentOrigin, setCurrentOrigin ] = useState( position ) // Tracks the origin while dragging
	const [ offset ] = useState( { x: 0, y: 0 } )

	const dragStart = e => {

		if ( 'touchstart' === e.type ) {
			setInitialPos( {
				x: e.nativeEvent.touches[0].clientX - offset.x,
				y: e.nativeEvent.touches[0].clientY - offset.y
			} )
		} else {
			setInitialPos( {
				x: e.nativeEvent.clientX - offset.x,
				y: e.nativeEvent.clientY - offset.y
			} )
		}

		if ( e.target.classList.contains( 'fl-asst-window-drag-handle' ) ||
			e.target.classList.contains( 'fl-asst-sidebar' )
		) {
			setIsDragging( true )
		}
	}

	const drag = e => {
		if ( isDragging ) {
			e.preventDefault()

			let ev = e.nativeEvent
			if ( 'touchmove' === e.type ) {
				ev = ev.touches[0]
			}

			const x = ev.clientX - initialPos.x
			const y = ev.clientY - initialPos.y

			const originX = ev.clientX > ( ref.current.clientWidth / 2 ) ? 1 : 0
			const originY = ev.clientY > ( ref.current.clientHeight / 2 ) ? 1 : 0

			requestAnimationFrame( () => {
				if ( 'undefined' !== typeof posRef.current && null !== posRef.current ) {
					posRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
				}

				// Make sure this always happens inside the Raf
				setCurrentOrigin( [ originX, originY ] )
			} )
		}
	}

	const dragEnd = e => {
		if ( ! e.currentTarget || ! isDragging ) {
			return false
		}

		let point = e.nativeEvent
		if ( 'touchend' === e.type ) {
			point = e.nativeEvent.changedTouches[0]
		}
		const x = point.clientX > ( ref.current.clientWidth / 2 ) ? 1 : 0
		const y = point.clientY > ( ref.current.clientHeight / 2 ) ? 1 : 0

		const reset = { x: 0, y: 0 }
		setInitialPos( reset )
		setCurrentPos( reset )

		//setOffset( reset )
		setIsDragging( false )
		setCurrentOrigin( [ x, y ] )
		setPosition( [ x, y ] )
		onChange( { origin: [ x, y ] } )
		requestAnimate()
		return false
	}

	const vAlign = 1 === currentOrigin[1] ? 'bottom' : 'top'
	const hAlign = 1 === currentOrigin[0] ? 'right' : 'left'
	const originClass = `fl-asst-window-layer-origin-${vAlign}-${hAlign}`

	const classes = classname( {
		'fl-asst-window-layer': true,
		'fl-asst-window-layer-is-dragging': isDragging,
		[`fl-asst-window-size-${size}`]: size,
	}, originClass, className )

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
	const transform = isDragging ? 'translate3d(' + xPos + 'px, ' + yPos + 'px, 0)' : ''
	const [ windowX, windowY ] = position
	const pad = 15

	let positionerStyles = {
		display: 'flex',
		flexDirection: 'column',
		position: 'absolute',
		top: adminBarSize() + pad,
		bottom: windowY ? pad : pad,
		right: windowX ? pad : 'auto',
		left: windowX ? 'auto' : pad,
		justifyContent: windowY ? 'flex-end' : 'flex-start',
		maxHeight: '100vh',
		willChange: 'transform',
		pointerEvents: 'none',
		transform,
	}
	if ( 'normal' === size && ! isHidden ) {
		positionerStyles = {
			display: 'flex',
			flexDirection: 'column',
			position: 'absolute',
			top: 0,
			bottom: 0,
			right: windowX ? 0 : 'auto',
			left: windowX ? 'auto' : 0,
			willChange: 'transform',
			pointerEvents: 'none',
			transform,
		}
	}

	return (
		<div id="fl-asst-canvas" { ...props }>
			<div className="fl-asst-window-positioner" ref={ posRef } style={ positionerStyles }>{children}</div>
		</div>
	)
}

const WindowPanel = ( {
	className,
	children,
	style,
	...rest
} ) => {
	const { size } = useContext( Window.Context )

	const classes = classname( {
		'fl-asst-window': true,
		[`fl-asst-window-${size}`]: size,
		'fl-asst-primary-content': true,
	}, className )

	const styles = {
		...style,
		display: 'flex',
		flexDirection: 'column',
	}

	const GrabBar = ( { ...rest } ) => {
		const styles = {
			display: 'flex',
			paddingTop: 4,
			alignItems: 'center',
			justifyContent: 'center',
			pointerEvents: 'none',
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			zIndex: 2,
		}
		return (
			<div className="fl-asst-window-grab-bar" style={ styles } { ...rest }>
				<svg width="40" height="4" viewBox="0 0 40 4" version="1.1" xmlns="http://www.w3.org/2000/svg">
					<path d="M2,2 L38,2" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
				</svg>
			</div>
		)
	}

	return (
		<Flipped flipId="window" spring={ transition }>
			<div className={ classes } style={ styles } { ...rest }>
				<GrabBar />
				<div className="fl-asst-window-content">{children}</div>
			</div>
		</Flipped>
	)
}

const WindowButton = ( { children, ...rest } ) => {
	const { toggleIsHidden } = useContext( Window.Context )
	const ref = createRef()

	useEffect( () => {
		if ( ref.current && 'function' === typeof ref.current.focus ) {
			ref.current.focus()
		}
	}, [] )
	return (
		<Flipped flipId="window" spring={ transition }>
			<button className="fl-asst-window-button fl-asst-window-drag-handle" ref={ ref } onClick={ toggleIsHidden } { ...rest }>
				<Flipped inverseFlipId="window">{children}</Flipped>
			</button>
		</Flipped>
	)
}
