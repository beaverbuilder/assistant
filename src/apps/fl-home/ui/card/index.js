import React from 'react'
import classname from 'classnames'
import './style.scss'

const Card = ( {
	tag: Tag = 'div',
	className,
	children,
	title,
	eyebrow,
	subtitle,
	padX = false,
	contentProps = {},
	footer,
	footerProps = {},
	...rest
} ) => {

	const { className: footClasses, ...footerRest } = footerProps
	const footerClasses = classname( 'fl-asst-card-footer', footClasses )

	const { className: contentClasses, ...contentRest } = contentProps

	return (
		<Tag
			className={ classname( {
				'fl-asst-card': true,
				'fl-asst-card-pad-x': padX
			}, className ) }
			{ ...rest }
		>
			{ ( title || eyebrow || subtitle ) && (
				<div className="fl-asst-card-header">
					{ eyebrow && <div className="fl-asst-card-eyebrow">{eyebrow}</div> }
					{ title && <div className="fl-asst-card-title">{title}</div> }
					{ subtitle && <div className="fl-asst-card-subtitle">{subtitle}</div> }
				</div>
			)}
			{ children && (
				<div
					className={ classname( 'fl-asst-card-content', contentClasses ) }
					{ ...contentRest }
				>
					{children}
				</div>
			)}
			{ footer && <div className={ footerClasses } { ...footerRest }>{footer}</div> }
		</Tag>
	)
}

export default Card
