import React, { useContext } from 'react'
import c from 'classnames'
import { motion } from 'framer-motion'
import CollectionContext from './context'
import * as Layout from '../layout'
import Button from '../button'

const variants = {
	initial: {
		scale: 0
	},
	normal: {
		scale: 1
	},
}
const transition = {
	layoutX: { duration: 0 },
	layoutY: false,
}

const Item = ( {
	tag: Tag = motion.li,

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
			layout
			initial={ false }
			animate="normal"
			exit="initial"
			variants={ variants }
			transition={ transition }
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
	truncate,
	icon,
	...rest
} ) => {

	if ( ! title && ! description ) {
		return null
	}

	const titleClasses = c( 'fluid-item-title', {
		'fluid-truncate': truncate,
	} )

	return (
		<div className="fluid-collection-item-text" { ...rest }>
			{ ( title || icon ) && (
				<div className={ titleClasses }>
					{ icon && <span>{icon}</span> }
					{title}
				</div>
			) }
			{ description && <div>{description}</div> }
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
