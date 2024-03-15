import React from 'react'
import c from 'classnames'
import { useHistory } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button, Icon, Text, Frame, Notice } from 'ui'
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
	const { notices, renderNotices } = Notice.useNotices()

	return (
		<Tag className={ classes } { ...rest }>
			{ notices && 0 < notices.length &&
				<div style={ { position: 'absolute', width: '100%', zIndex: 1 } }>
					{ renderNotices() }
				</div>
			}
			<div className="fluid-detail-sidebar-backdrop" />
			<div className="fluid-detail-page-toolbar">
				<div className="fluid-detail-page-toolbar-area">
					<Button
						appearance="transparent"
						shape="round"
						onClick={ goBack }
						icon={ <Icon.ArrowLeft /> }
					/>
					{ toolbarTitle && <Text.Title>{toolbarTitle}</Text.Title> }
				</div>
				{ toolbarActions && (
					<div className="fluid-detail-page-toolbar-area">
						{ toolbarActions }
					</div>
				) }
			</div>
			{ ( title || thumbnail ) &&
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
			}
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
