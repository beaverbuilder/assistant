import React, { useState } from 'react'
import classname from 'classnames'
import { useHistory } from 'react-router-dom'
import { Page, Layout, Button, Icon } from 'ui'
import { isColor } from 'utils/color'
import { isURL } from 'utils/url'
import { __ } from '@wordpress/i18n'
import { ENTER } from '@wordpress/keycodes'
import InlineCreate from './inline-create'
import Loading from './loading'

export const defaultItemProps = {
	thumbnailSize: 'med',
}

export const getDefaultItemProps = ( item, defaultProps ) => {
	let props = { ...defaultProps }

	if ( 'object' === typeof item ) {
		props = { ...props, ...item }
	}

	// Find a label
	if ( 'undefined' === typeof props.label ) {
		if ( 'string' === typeof item ) {
			props.label = item
		} else if ( 'object' === typeof item ) {
			const labelKeys = [ 'label', 'title', 'name', 'postTitle', 'text', 'message' ]
			const labelKey = labelKeys.find( key => item.hasOwnProperty( key ) )
			if ( labelKey ) {
				props.label = item[labelKey]
			}
		}
	}

	// Find subtitle
	if ( 'object' === typeof item && 'undefined' === typeof props.description ) {
		const subtitleKeys = [ 'subtitle', 'description', 'caption' ]
		const subtitleKey = subtitleKeys.find( key => item.hasOwnProperty( key ) )
		if ( subtitleKey ) {
			props.description = item[subtitleKey]
		}
	}

	// Find thumbnail
	if ( 'object' === typeof item && 'undefined' === typeof props.thumbnail ) {
		const imgKeys = [ 'thumbnail', 'thumb', 'icon', 'image', 'img', 'cover' ]
		const imgKey = imgKeys.find( key => item.hasOwnProperty( key ) )
		if ( imgKey ) {
			props.thumbnail = item[imgKey]
		}
	}

	return props
}

export const getListWrapperType = type => {
	switch ( type ) {
	case 'ordered':
		return 'ol'
	default:
		return 'ul'
	}
}

export const getItemType = ( item, isSection = false ) => {
	return isSection ? Section : Item
}

export const getDefaultSectionProps = ( section, defaultProps ) => {
	return {
		...defaultProps,
		label: 'undefined' === typeof section.label ? '' : section.label,
	}
}

/**
 * The default list item component.
 */
const InfoItem = ( {
	label,
	description,
	shouldAlwaysShowThumbnail = false, // regardless of hasThumbnail
	thumbnail,
	thumbnailSize = 'med',
	className,
	extras,
	accessory,
	marks = [],
	before,
} ) => {
	const classes = classname( {
		'fl-asst-list-item-content-info': true,
	}, className )

	let hasThumbnail = false
	let color = false
	if ( thumbnail && isURL( thumbnail ) ) {
		hasThumbnail = true
	} else if ( label && isColor( label ) ) {
		hasThumbnail = true
		color = label
	}

	let Tag = 'div'
	let newProps = {

	}

	const thumbClasses = classname( {
		'fl-asst-list-item-thumbnail': true,
		[`fl-asst-thumbnail-size-${thumbnailSize}`]: thumbnailSize,
		'fl-asst-round': color,
	} )

	const itemExtras = 'function' === typeof extras ? extras( {} ) : null
	const accessories = 'function' === typeof accessory ? accessory( {} ) : null
	const stopProp = e => e.stopPropagation()

	const renderMarks = marks => marks.map( ( mark, i ) => {
		return (
			<span key={ i } className="fl-asst-list-item-mark">{mark}</span>
		)
	} )

	return (
		<Tag className={ classes } { ...newProps }>
			{ before && <div className="fl-asst-list-item-before-content">{before}</div> }
			<div className="fl-asst-list-item-default-content-row">
				{ ( hasThumbnail || shouldAlwaysShowThumbnail ) &&
					<div className={ thumbClasses }>
						{ thumbnail && 'string' === typeof thumbnail && <img src={ thumbnail } /> }
						{ thumbnail && 'string' !== typeof thumbnail && thumbnail }
						{ color && <div className="fl-asst-list-item-color-thumbnail"  style={ { backgroundColor: color } } /> }
					</div>
				}
				<div className="fl-asst-list-item-subject">
					{ label && <div className="fl-asst-list-item-title">{label}</div> }
					{ description && <div className="fl-asst-list-item-description">{description}</div> }
				</div>
				{ accessories && <div className="fl-asst-list-item-accessory" onClick={ stopProp }>{accessories}</div>}
			</div>

			{ itemExtras && <div className="fl-asst-list-item-extras" onClick={ stopProp }>{itemExtras}</div> }

			{ 0 < marks.length && <div className="fl-asst-list-item-marks">
				{ renderMarks( marks ) }
			</div> }
		</Tag>
	)
}

export const Item = ( {
	children,
	className,
	tag: Tag = 'li',
	to,
	...rest
} ) => {
	const classes = classname( {
		'fl-asst-list-item': true,
		'fl-asst-is-clickable': to,
	}, className )
	const history = useHistory()
	const [ isHovering, setIsHovering ] = useState( false )
	const [ isFocused, setIsFocused ] = useState( false )

	let props = {
		className: classes,
		onMouseOver: () => ! isHovering && setIsHovering( true ),
		onMouseOut: () => isHovering && setIsHovering( false ),
		onFocus: () => setIsFocused( true ),
		onBlur: () => setIsFocused( false ),
	}

	let itemProps = {
		...rest,
		isHovering,
		isFocused,
	}

	if ( to ) {
		let path = ''
		let state = null

		// list item is actionable
		props.tabIndex = 0

		if ( 'string' === typeof to ) {
			path = to
		}
		if ( 'object' === typeof to ) {
			path = to.pathname
			state = to.state
		}
		props.onClick = () => history.push( path, state )

		props.onKeyPress = e => {
			const { keyCode } = e.nativeEvent

			if ( ENTER === keyCode ) {
				history.push( path, state )
			}
		}
	}

	const content = 'function' === typeof children ? children( rest ) : <InfoItem { ...itemProps } />

	return (
		<Tag { ...props }>{content}</Tag>
	)
}

const Section = ( {
	children,
	label,
	footer,
	padX = false, /* Page.Section.padX defaults to true */
	padY = false,
	...rest
} ) => {
	return (
		<Page.Section label={ label } padX={ padX } padY={ padY } footer={ footer } { ...rest }>
			{children}
		</Page.Section>
	)
}

const MessageBox = ( { children, ...rest } ) => {
	return (
		<div style={ {
			padding: 'var(--fluid-sm-space)',
			flex: '0 0 auto',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center'
		} }>
			<Layout.Box
				{ ...rest }
				style={ {
					background: 'var(--fluid-box-background)',
					color: 'var(--fluid-box-color)',
					borderRadius: '7px',
					display: 'flex',
					alignItems: 'center',
					padding: 'var(--fluid-med-space)'
				} }
			>{children}</Layout.Box>
		</div>
	)
}

export const NoResultsMessage = ( { message } ) => {
	return (
		<MessageBox>{ message ? message : __( 'No Results Found' ) }</MessageBox>
	)
}

export const EndMessage = () => {
	return (
		<Layout.Row>
			<Button
				tag='span'
				role={false}
				size="lg"
				style={{
					borderRadius: '50%',
					width: 60,
					height: 60,
					padding: 5,
					pointerEvents: 'none'
				}} >
				<Icon.Pencil size={30} />
			</Button>
		</Layout.Row>
	)
}

export { InlineCreate, Loading }
