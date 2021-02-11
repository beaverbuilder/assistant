import React from 'react'
import c from 'classnames'
import { useHistory } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button, Icon, Text, Frame } from 'ui'
import './style.scss'

const DetailPage = ( {
	tag: Tag = 'div',
	toolbarTitle,
	toolbarActions,
	title,
	tabs,
	thumbnail,
	className,
	children,
	...rest
} ) => {

	Frame.use()
	const { goBack } = useHistory()
	const classes = c( 'fluid-page', 'fluid-detail-page', className )
	return (
		<Tag className={ classes } { ...rest }>
			<div className="fluid-detail-sidebar-backdrop" />
			<div className="fluid-detail-page-toolbar">
				<div className="fluid-detail-page-toolbar-area">
					<Button appearance="transparent" onClick={ goBack }>
						<Icon.ArrowLeft />
					</Button>
					{ toolbarTitle && <Text.Title>{toolbarTitle}</Text.Title> }
				</div>
				{ toolbarActions && (
					<div className="fluid-detail-page-toolbar-area">
						{ toolbarActions }
					</div>
				) }
			</div>
			<div className="fluid-detail-page-hero">
				<div className="fluid-hero-group">
					{ title && (
						<motion.div
							layout="position"
							className="fluid-detail-page-title-text"
						>
							{title}
						</motion.div>
					) }
					{ thumbnail && (
						<motion.div layout="position" className="fluid-detail-page-thumbnail">
							{ thumbnail }
						</motion.div>
					) }
				</div>
			</div>
			{ tabs && (
				<div className="fluid-detail-page-tabs">
					<Button.Group>
						<Button isSelected>General</Button>
						<Button>Edit</Button>
						<Button>Comment</Button>
					</Button.Group>
				</div>
			) }
			<div className="fluid-detail-page-content-area">
				{ children }
			</div>
		</Tag>
	)
}

export default DetailPage
