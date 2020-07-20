import React from 'react'
import c from 'classnames'
import './style.scss'

const Title = ( {
	tag: Tag = 'div',
	eyebrow,
	eyebrowTag: Eyebrow = 'div',
	subtitle,
	subtitleTag: Subtitle = 'div',
	children,
	className,
	...rest
} ) => {
	const classes = c( 'fluid-text-title', className )
	return (
		<Tag className={ classes } { ...rest }>
			{ eyebrow && <Eyebrow className="fluid-text-eyebrow">{eyebrow}</Eyebrow> }
			<span style={ { display: 'inline-flex' } }>{ children }</span>
			{ subtitle && <Subtitle className="fluid-text-subtitle">{subtitle}</Subtitle> }
		</Tag>
	)
}

// Keeps content centered and at a ledgible line length
const ContentArea = ( { tag: Tag = 'div', className, ...rest } ) => {
	console.warn( 'Use Layout.ContentBoundary instead of Text.ContentArea' )
	return (
		<Tag
			className={ c( 'fluid-content-area', className ) }
			{ ...rest }
		/>
	)
}

export {
	Title,
	ContentArea,
}
