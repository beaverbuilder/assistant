import React, { Children, useState } from 'react'
import c from 'classnames'
import * as Text from '../../text'
import Button from '../../button'

const Caret = ( { isOpen = false } ) => {

	const style = {
		transform: isOpen ? 'rotate( 90deg )' : 'rotate( 0deg )'
	}

	return (
		<svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" style={ style }>
			<path d="M1 9L5 5.1875L1 1.375" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
		</svg>
	)
}

const Item = ( {
	tag: Tag = 'li',
	contentTag: Content = 'div',

	// Text.Title API
	title,
	eyebrow,
	subtitle,

	// Primary Target (Button) API
	to,
	href,
	onClick,
	rel,
	target,

	thumbnail,
	size = 'med', // sm | med | lg

	// Handle sub-items via children
	children,
	showChildren: _showChildren = true,

	// Add action buttons to the end of an item's content element
	actions,
	className,
	...rest
} ) => {
	const [ showChildren, setShowChildren ] = useState( _showChildren )
	const hasChildren = 0 < Children.count( children )

	const classes = c( 'fluid-item', {
		'fluid-size-sm': 'sm' === size,
		'fluid-size-med': 'med' === size,
		'fluid-size-lg': 'lg' === size,
		'fluid-has-children': hasChildren,
	}, className )

	return (
		<Tag
			className={ classes }
			{ ...rest }
		>
			{ title && (
				<Content className="fluid-item-content">

					<Button
						className="fluid-item-primary-action"
						to={ to }
						href={ href }
						onClick={ onClick }
						rel={ rel } target={ target }
					>
						{ thumbnail && <div className="fluid-item-thumbnail">{thumbnail}</div> }
						<Text.Title eyebrow={ eyebrow } subtitle={ subtitle }>{title}</Text.Title>
					</Button>

					{ actions && (
						<div className="fluid-item-actions">{actions}</div>
					)}

					{ hasChildren && (
						<div className="fluid-item-gutter-content">
							<button onClick={ () => setShowChildren( ! showChildren ) }>
								<Caret isOpen={ showChildren } />
							</button>
						</div>
					) }
				</Content>
			)}
			{ children && showChildren && (
				<ul className="fluid-list">{children}</ul>
			)}
		</Tag>
	)
}

export default Item
