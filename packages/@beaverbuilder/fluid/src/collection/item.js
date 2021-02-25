import React, { useContext } from 'react'
import c from 'classnames'
import CollectionContext from './context'
import * as Layout from '../layout'
import Button from '../button'

const Item = ( {
	tag: Tag = 'li',
	title,
	description,
	thumbnail,
	thumbnailProps,
	truncateTitle = true,
	icon,
	onClick,
	href,
	to,
	className,
	children,
	...rest
} ) => {
	const { appearance } = useContext( CollectionContext )
	const Component = 'list' === appearance ? ListItem : GridItem

	const props = {
		title,
		truncateTitle,
		thumbnail,
		thumbnailProps,
		description,
		icon,
	}
	const btnProps = {
		onClick,
		href,
		to,
		className: 'fluid-collection-item-primary-action',
		appearance: 'transparent',
	}

	return (
		<Tag
			className={ c( 'fluid-collection-item', className ) }
			{ ...rest }
		>
			<Button { ...btnProps }>
				{ ( title || thumbnail ) && <Component { ...props }/>}
				{children}
			</Button>
		</Tag>
	)
}

const Thumbnail = ( { children, ratio = '4:3', ...rest } ) => {
	return (
		<div className="fluid-collection-item-thumbnail">
			<Layout.AspectBox
				ratio={ ratio }
				{ ...rest }
			>
				{children}
			</Layout.AspectBox>
		</div>
	)
}

const Text = ( {
	title,
	description,
	icon,
	truncate = true,
	className,
	...rest
} ) => {

	if ( ! title && ! description ) {
		return null
	}

	const classes = c( 'fluid-collection-item-text', {
		'item-has-icon': icon,
	}, className )

	return (
		<div className={ classes } { ...rest }>
			{ ( title || icon ) && (
				<>
					{ icon && <span className="fluid-collection-item-icon">{icon}</span> }
					<div className="fluid-item-title">
						<span className={ c( 'fluid-item-title-text', { 'fluid-truncate': truncate } ) } >
							{title}
						</span>
						{ description && <span className="fluid-item-description fluid-truncate">{description}</span> }
					</div>
				</>
			) }
		</div>
	)
}

const GridItem = ( {
	title,
	description,
	truncateTitle,
	thumbnail,
	thumbnailProps,
	icon,
	tag: Tag = 'div',
	...rest
} ) => {
	return (
		<Tag className="fluid-collection-item-grid-content" { ...rest }>
			{ thumbnail && <Thumbnail { ...thumbnailProps }>{thumbnail}</Thumbnail>}
			<Text
				title={ title }
				truncate={ truncateTitle }
				description={ description }
				icon={ icon }
			/>
		</Tag>
	)
}

const ListItem = ( {
	title,
	description,
	truncateTitle,
	thumbnail,
	thumbnailProps,
	icon,
	...rest
} ) => {
	return (
		<div className="fluid-collection-item-list-content" { ...rest }>
			{ thumbnail && <Thumbnail { ...thumbnailProps }>{thumbnail}</Thumbnail>}
			<Text
				title={ title }
				truncate={ truncateTitle }
				description={ description }
				icon={ icon }
			/>
		</div>
	)
}

export default Item
