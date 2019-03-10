import React, {
	Children,
	useState,
	useEffect,
	useLayoutEffect,
	cloneElement,
	forwardRef,
	createRef
} from 'react'
import { animated, useSpring } from 'react-spring'
import classname from 'classnames'
import { Button } from 'components'
import { useSystemState } from 'store'
import './style.scss'

export const NavBar = props => {
	const {
		children,
		className,
		isExpanded = false,
		onChange = () => {},
	} = props
	const { shouldReduceMotion } = useSystemState()

	const expandedRef = createRef()
	const collapsedRef = createRef()
	const [shouldAnimate, setShouldAnimate] = useState( false )
	const [expandedHeight, setExpandedHeight ] = useState( 0 )
	const [collapsedHeight, setCollapsedHeight ] = useState( 0 )
	const style = useSpring({
		height: isExpanded ? expandedHeight : collapsedHeight,
		immediate: ! shouldAnimate || shouldReduceMotion,
		onRest: () => {
			// Don't animate on initial render
			if ( ! shouldAnimate ) {
				setShouldAnimate( true )
			}
		}
	})

	// Measure child heights
	useLayoutEffect( () => {

		if ( expandedRef.current ) {
			setExpandedHeight( expandedRef.current.offsetHeight )
		}
		if ( collapsedRef.current ) {
			setCollapsedHeight( collapsedRef.current.offsetHeight )
		}
	}, [] )

	const classes = classname( {
		'fl-asst-nav-bar': true,
		'fl-asst-nav-bar-is-expanded': isExpanded,
	}, className )

	const merged = {
		...props,
		className: classes,
		style,
	}
	delete merged.isExpanded

	const contents = Children.map( children, item => {
		if ( item.type === Expanded || item.type === Collapsed ) {

			let ref = null
			if ( item.type === Expanded ) {
				ref = expandedRef
			} else if ( item.type === Collapsed ) {
				ref = collapsedRef
			}

			return cloneElement( item, {
				...item.props,
				isExpanded,
				ref,
			} )
		}
	} )

	return (
		<animated.div {...merged}>
			{contents}
			<div className="fl-asst-nav-bar-footer">
				<MoreButton onClick={onChange} isExpanded={isExpanded} />
			</div>
		</animated.div>
	)
}

const Expanded = forwardRef( ( props, ref ) => {
	const { className, isExpanded } = props
	const { shouldReduceMotion } = useSystemState()
	const classes = classname( {
		'fl-asst-nav-bar-content': true,
		'fl-asst-nav-bar-content-expanded': true,
	}, className )

	const style = useSpring( {
		transform: isExpanded ? 'translateY(0px)' : 'translateY(145px)',
		opacity: isExpanded ? 1 : 0,
		immediate: shouldReduceMotion,
	} )

	const merged = {
		...props,
		className: classes,
		style,
		ref
	}
	delete merged.isExpanded

	return (
		<animated.div {...merged} />
	)
} )

const Collapsed = forwardRef( ( props, ref ) => {
	const { className, isExpanded } = props
	const { shouldReduceMotion } = useSystemState()
	const classes = classname( {
		'fl-asst-nav-bar-content': true,
		'fl-asst-nav-bar-content-collapsed': true,
	}, className )

	const style = useSpring( {
		transform: isExpanded ? 'translateY(-100%)' : 'translateY(0%)',
		opacity: isExpanded ? 0 : 1,
		immediate: shouldReduceMotion,
	} )

	const merged = {
		...props,
		className: classes,
		style,
		ref,
	}
	delete merged.isExpanded

	return (
		<animated.div {...merged} />
	)
} )

const MoreButton = props => {
	const { isExpanded } = props
	const line = '2,4 25,4 48,4'
	const up = '5,6 25,2 45,6'

	const merged = { ...props}
	delete merged.isExpanded

	return (
		<Button {...merged} appearance="transparent">
			<svg className="fl-asst-icon" width="50px" height="8px" viewBox="0 0 50 8">
				<g
					fill="transparent"
					fillRule="nonzero"
					stroke="currentColor"
					strokeWidth="4"
					strokeLinecap="round"
				>
					<polyline points={ isExpanded ? up : line } />
				</g>
			</svg>
		</Button>
	)
}

NavBar.Expanded = Expanded
NavBar.Collapsed = Collapsed
