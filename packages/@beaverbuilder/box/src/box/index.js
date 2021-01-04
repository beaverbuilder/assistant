import React from 'react'
import { getHeightForRatio } from '../utils'
import ErrorBoundary from './error-boundary'

const defaultPadding = {
	sm: 5,
	med: 10,
	lg: 20
}

const padding = ( pad, padX, padY ) => {
	let styles = {}

	// pad attribute
	if ( pad ) {
		if ( pad ) {
			let value = defaultPadding.med

			switch ( pad ) {
			case 'sm':
			case 'small':
				value = defaultPadding.sm
				break
			case 'med':
			case 'medium':
			case true:
				value = defaultPadding.med
				break
			case 'lg':
			case 'large':
				value = defaultPadding.lg
				break
			default:
				value = pad
			}
			styles.padding = value
		}
	}

	// padX attribute
	if ( padX ) {
		let value = defaultPadding.med

		switch ( padX ) {
		case 'sm':
		case 'small':
			value = defaultPadding.sm
			break
		case 'med':
		case 'medium':
		case true:
			value = defaultPadding.med
			break
		case 'lg':
		case 'large':
			value = defaultPadding.lg
			break
		default:
			value = padX
		}
		styles.paddingTop = value
		styles.paddingBottom = value
	}

	// padX attribute
	if ( padY ) {
		let value = defaultPadding.med

		switch ( padY ) {
		case 'sm':
		case 'small':
			value = defaultPadding.sm
			break
		case 'med':
		case 'medium':
		case true:
			value = defaultPadding.med
			break
		case 'lg':
		case 'large':
			value = defaultPadding.lg
			break
		default:
			value = padY
		}
		styles.paddingLeft = value
		styles.paddingRight = value
	}

	return styles
}

const layout = props => {
	let styles = {}
	if ( props.row || props.column || props.gap ) {
		styles = {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			gap: props.gap,
		}
		styles.flexDirection = props.row ? 'row' : 'column'
	}
	return styles
}

const handleProps = props => {
	const {
		style,
		ratio,
		pad,
		padX,
		padY,
		...rest
	} = props

	const _style = {
		boxSizing: 'border-box',
		...layout( props ),
		...padding( pad, padX, padY ),
		...style
	}

	if ( ratio ) {
		_style.position = 'relative'
		_style.padding = null
		_style.paddingTop = null
		_style.paddingLeft = null
		_style.paddingRight = null
		_style.paddingBottom = null
		_style.paddingTop = getHeightForRatio( ratio, props.width, props.height )
	}

	return {
		...rest,
		style: { ..._style, ...style }
	}
}

const innerStyle = {
	position: 'absolute',
	top: 0,
	left: 0,
	width: '100%',
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
}

const Box = props => {
	const {
		tag: Tag = 'div',
		innerTag: Inner = 'div',
		children,
		errorBoundary,
		...rest
	} = handleProps( props )

	const hasAspect = props.ratio

	return (
		<Tag { ...rest }>
			{ errorBoundary && (
				<ErrorBoundary alternate={ errorBoundary }>
					{ hasAspect && <Inner style={ innerStyle }>{children}</Inner> }
					{ ! hasAspect && children }
				</ErrorBoundary>
			) }
			{ ! errorBoundary && (
				<>
					{ hasAspect && <Inner style={ innerStyle }>{children}</Inner> }
					{ ! hasAspect && children }
				</>
			) }
		</Tag>
	)
}

export default Box
