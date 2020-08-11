import React, { useRef, useState } from 'react'
import c from 'classnames'
import { motion, useElementScroll, useTransform, useMotionTemplate } from 'framer-motion'
import { Layout, Button, Icon } from 'assistant/ui'
import './style.scss'

export default () => {
	const ref = useRef()
	const { scrollYProgress } = useElementScroll( ref )
	const [ currentTab, setCurrentTab ] = useState( 'general' )

	const tabs = {
		general: 'General',
		details: 'Details',
		content: 'Content',
		comments: 'Comments'
	}

	const inputRange = [ 0, 50 ]
	const outputRange = [ 0, 20 ]
	const depth = useTransform( scrollYProgress, inputRange, outputRange )
	const shadow = useMotionTemplate`0 ${depth}px ${depth}px rgba(0,0,0,0.1)`

	return (
		<div
			ref={ ref }
			style={ {
				flex: '1 1 auto',
				display: 'flex',
				flexDirection: 'column',
				position: 'relative',
				minHeight: 0,
				maxHeight: '100%',
				overflowY: 'scroll',
				paddingBottom: 100
			} }
		>
			<motion.div
				style={ {
					position: 'sticky',
					top: 0,
					paddingBottom: 10,
					zIndex: 2,
					background: 'var(--fluid-background)',
					boxShadow: shadow,
				} }
			>

				<Layout.Toolbar>
					<Button icon="arrow-left" appearance="transparent" />

					{ Object.entries( tabs ).map( ( [ key, label ] ) => {
						const isSelected = currentTab === key
						return (
							<button
								key={ key }
								className={ c( 'fluid-button', {
									'is-selected': isSelected,
									'fluid-appearance-transparent': ! isSelected,
								} ) }
								onClick={ () => setCurrentTab( key ) }
							>{label}</button>
						)
					} )}
				</Layout.Toolbar>

				<Hero />
			</motion.div>

			<Form />

			<p>Curabitur blandit tempus porttitor. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean lacinia bibendum nulla sed consectetur.</p>
			<p>Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Sed posuere consectetur est at lobortis. Donec ullamcorper nulla non metus auctor fringilla. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Nullam quis risus eget urna mollis ornare vel eu leo. Etiam porta sem malesuada magna mollis euismod.</p>
			<p>Sed posuere consectetur est at lobortis. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.</p>
			<p>Curabitur blandit tempus porttitor. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean lacinia bibendum nulla sed consectetur.</p>
			<p>Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Sed posuere consectetur est at lobortis. Donec ullamcorper nulla non metus auctor fringilla. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Nullam quis risus eget urna mollis ornare vel eu leo. Etiam porta sem malesuada magna mollis euismod.</p>
			<p>Sed posuere consectetur est at lobortis. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.</p>
			<p>Curabitur blandit tempus porttitor. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean lacinia bibendum nulla sed consectetur.</p>
			<p>Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Sed posuere consectetur est at lobortis. Donec ullamcorper nulla non metus auctor fringilla. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Nullam quis risus eget urna mollis ornare vel eu leo. Etiam porta sem malesuada magna mollis euismod.</p>
			<p>Sed posuere consectetur est at lobortis. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.</p>
			<p>Curabitur blandit tempus porttitor. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean lacinia bibendum nulla sed consectetur.</p>
			<p>Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Sed posuere consectetur est at lobortis. Donec ullamcorper nulla non metus auctor fringilla. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Nullam quis risus eget urna mollis ornare vel eu leo. Etiam porta sem malesuada magna mollis euismod.</p>
			<p>Sed posuere consectetur est at lobortis. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.</p>
		</div>
	)
}

const Hero = () => {
	return (
		<motion.div
			style={ {
				borderRadius: 10,
				background: 'var(--fluid-opaque-12)',
				overflow: 'hidden',
				flex: '0 0 auto',
				margin: '0 10px'
			} }
		>
			<Layout.AspectBox ratio="4:3" />
		</motion.div>
	)
}

const Form = () => {
	return (
		<div style={ { marginTop: 20 } }>
			<Section title="Title & Slug">
				<Item label="Title">
					Super Cool Post
				</Item>
				<Item label="URL">
					<a href="#" appearance="transparent">http://www.whatever-site.com/super-cool-post</a>
					<Button icon="edit" style={ { marginRight: 5 } } />
					<Button icon="link" />
				</Item>
			</Section>
			<Section title="Publish Settings">
				<Item label="Status">Published</Item>
				<Item label="Visibility">Public</Item>
				<Item label="Publish Date">
					<Button appearance="transparent" style={ { paddingRight: 0 } }>
						August 32, 2020 1:13pm
						<Icon.CaretDown style={ { marginLeft: 5 } } />
					</Button>
				</Item>
				<Item label="Author">Brent</Item>
			</Section>
			<Section title="Post Loop">
				<Item label="Excerpt">Auto</Item>
				<Item label="Sticky">
					Stick to top
					<input type="checkbox" checked />
				</Item>
			</Section>
		</div>
	)
}

const Section = ( { title, children } ) => {
	return (
		<div className="fluid-form-section">
			<div className="fluid-form-section-header">{title}</div>
			<div className="fluid-form-section-content">{children}</div>
		</div>
	)
}

const Item = ( { label, children } ) => {
	return (
		<div className="fluid-form-item">
			<label>{label}</label>
			{children}
		</div>
	)
}
