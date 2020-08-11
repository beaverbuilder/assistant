import React from 'react'
import { motion } from 'framer-motion'
import { __ } from '@wordpress/i18n'
import { Button, Layout, Icon, Text } from 'assistant/ui'
import './style.scss'

const Help = ( { onClose = () => {} } ) => {
	return (
		<motion.div
			layoutId="help"
			className="fl-asst-help-wrap"
			transition={ {
				duration: 0.25
			} }
		>
			<Layout.Row style={ { paddingLeft: 10, minHeight: 50, alignItems: 'center' } } >
				<Text.Title>{__( 'Assistant Apps' )}</Text.Title>
				<Button
					onClick={ onClose }
					icon="close-compact"
					appearance="transparent"
					style={ { marginLeft: 'auto' } }
					size="sm"
				/>
			</Layout.Row>
			<div
				style={ {
					display: 'grid',
					gridTemplateColumns: '1fr 1fr',
					gridGap: 10
				} }
			>
				<App
					title="Content"
					description="Quickly find posts and pages. Edit their details."
				/>
				<App
					title="Media"
					description="Manage images, videos and documents"
				/>
				<App
					title="Comments"
					description="Review recent comments and manage spam."
				/>
				<App
					title="Updates"
					description="Keep your plugins and themes up to date."
				/>
				<App
					title="Libraries"
					description="Sync creative assets and posts between sites"
				/>
				<App
					title="Tags"
					description="Use labels to organize your posts"
				/>
			</div>
		</motion.div>
	)
}

const App = ( {
	title,
	description,
	icon: AppIcon = Icon.Placeholder,
	...rest
} ) => {
	return (
		<Button className="fl-asst-help-app" { ...rest } >
			<span className="fl-asst-help-app-icon-wrap">
				<AppIcon />
			</span>
			<Text.Title>{title}</Text.Title>
			{ description && <p>{description}</p> }
		</Button>
	)
}

export default Help
