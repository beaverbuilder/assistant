import React from 'react'
import { getHeightForRatio } from '../utils'

const defaultPadding = {
	sm: 5,
	med: 10,
	lg: 20
}

const padding = props => {
	let styles = {}

	// pad attribute
	if ( props.pad ) {
		if ( props.pad ) {
			let value = defaultPadding.med

			switch ( props.pad ) {
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
				value = props.pad
			}

			styles.padding = value
		}
	}

	// padX attribute
	if ( props.padX ) {
		let value = defaultPadding.med

		switch ( props.padX ) {
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
			value = props.padX
		}

		styles.paddingTop = value
		styles.paddingBottom = value
	}

	// padX attribute
	if ( props.padY ) {
		let value = defaultPadding.med

		switch ( props.padY ) {
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
			value = props.padY
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
	const { style, ratio, ...rest } = props

	const _style = {
		boxSizing: 'border-box',
		...layout( props ),
		...padding( props ),
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
		...rest
	} = handleProps( props )

	const hasAspect = props.ratio

	return (
		<Tag { ...rest }>
			{ hasAspect && <Inner style={ innerStyle }>{children}</Inner> }
			{ ! hasAspect && children }
		</Tag>
	)
}

export default Box
