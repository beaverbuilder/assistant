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
	role,
	level = 2,
	...rest
} ) => {
	const classes = c( 'fluid-text-title', className )
	return (
		<Tag
			className={ classes }
			role={ role ? role : 'heading' }
			aria-level={ level }
			{ ...rest }
		>
			{ eyebrow && <Eyebrow className="fluid-text-eyebrow">{eyebrow}</Eyebrow> }
			<span style={ { display: 'inline-flex' } }>{ children }</span>
			{ subtitle && <Subtitle className="fluid-text-subtitle">{subtitle}</Subtitle> }
		</Tag>
	)
}

export { Title }
