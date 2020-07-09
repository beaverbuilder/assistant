import React from 'react'
import classname from 'classnames'

const Section = ( {
	tag: Tag = 'div',
	contentTag: Content = 'ul',
	title,
	className,
	children,
	...rest
} ) => {
	return (
		<Tag
			className={ classname( 'fluid-list-section', className ) }
			{ ...rest }
		>
			{ title && (
				<div className="fluid-list-section-title">
					<span>{title}</span>
				</div>
			)}
			<Content className="fluid-list-section-content fluid-list">{children}</Content>
		</Tag>
	)
}

export default Section
