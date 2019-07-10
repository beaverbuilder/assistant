import React from 'fl-react'
import classname from 'fl-classnames'
import { Nav } from '../../'
import { isColor } from 'shared-utils/color'
import { isURL } from 'shared-utils/url'

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
	case 'definition':
		return 'dl'
	default:
		return 'ul'
	}
}

export const getItemType = ( item, isSection = false ) => {
	return isSection ? Section : Item
}

const InfoItem = ( {
	label,
	description,
	shouldAlwaysShowThumbnail = false, // regardless of hasThumbnail
	thumbnail,
	thumbnailSize = 'med',
	className,
	to,
	...rest
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
	let newProps = { ...rest }

	if ( to ) {
		Tag = Nav.Link
		newProps.to = to
	}

	const thumbClasses = classname({
		'fl-asst-list-item-thumbnail' : true,
		[`fl-asst-thumbnail-size-${thumbnailSize}`] : thumbnailSize,
		'fl-asst-round' : color,
	})

	return (
		<Tag className={classes} {...newProps}>

			{ ( hasThumbnail || shouldAlwaysShowThumbnail ) &&
				<div className={thumbClasses}>
					{ thumbnail && <img src={thumbnail} /> }
					{ color && <div className="fl-asst-list-item-color-thumbnail"  style={{ backgroundColor: color }} /> }
				</div>
			}

			<div className="fl-asst-list-item-subject">
				{ label && <div className="fl-asst-list-item-title">{label}</div> }
				{ description && <div className="fl-asst-list-item-description">{description}</div> }
			</div>
		</Tag>
	)
}

export const Item = ( {
	children,
	className,
	tag: Tag = 'li',
	...rest
} ) => {
	const classes = classname( 'fl-asst-list-item', className )
	const props = {
		className: classes,
		tabIndex: -1,
	}
	return (
		<Tag {...props}>{ children ? children : <InfoItem {...rest} /> }</Tag>
	)
}

const Section = ( { children, className, label, ...rest } ) => {
	const classes = classname( 'fl-asst-list-section', className )
	return (
		<div className={classes} {...rest}>
			<hr/>
			<div className="fl-asst-list-section-header">{label}</div>
			<div className="fl-asst-list-section-content">{children}</div>
		</div>
	)
}
