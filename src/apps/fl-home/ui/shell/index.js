import React from 'react'
import c from 'classnames'
import { __ } from '@wordpress/i18n'
import { DOWN, UP } from '@wordpress/keycodes'
import { useHistory } from 'react-router-dom'
import { App, Button, Icon } from 'assistant/ui'
import './style.scss'

const Shell = ( {
	className,
	children,
	baseURL,
	...rest
} ) => {
	const classes = c( 'fluid-page', 'fl-asst-home-shell', className )
	return (
		<div className={ classes } { ...rest }>
			<nav className="fl-asst-home-shell-sidebar">
				<div
					style={ {
						fontSize: 18,
						minHeight: 80,
						display: 'flex',
						alignItems: 'center',
						padding: 20,
						paddingLeft: 25
					} }
				>
					<Branding />
				</div>
				<FeatureSidebarSection baseURL={ baseURL } />
				<AppsSection />
				<ShortcutsSection />
			</nav>
			<div className="fl-asst-home-shell-content">
				{children}
			</div>
		</div>
	)
}

const Branding = () => (
	<>
		<Icon.PencilOutline style={ { marginRight: 13 } } />
		{ __( 'Assistant' ) }
	</>
)

const SidebarSection = ( {
	title,
	className,
	children,
	...rest
} ) => {

	const classes = c( 'fl-asst-home-shell-sidebar-section', className )

	return (
		<div className={ classes } { ...rest }>
			{ title && (
				<div className="fl-asst-home-shell-sidebar-section-title">
					{title}
				</div>
			) }
			<div>
				{children}
			</div>
		</div>
	)
}

const FeatureSidebarSection = ( { baseURL = '' } ) => {
	return (
		<SidebarSection>
			<ul>
				<li>
					<Button
						to={ `${baseURL}/` }
						appearance="transparent"
						icon={ <Icon.Dashboard /> }
						isSelected
					>
						{ __( 'Dashboard', 'fl-assistant' ) }
					</Button>
				</li>
			</ul>
		</SidebarSection>
	)
}

const AppsSection = () => {
	const history = useHistory()
	return (
		<SidebarSection title={ __( 'Apps', 'fl-assistant' ) }>
			<App.List>
				{ ( { label, handle, icon, moveDown, moveUp } ) => {

					const location = {
						pathname: `/${handle}`
					}
					const iconProps = {
						icon,
						context: 'sidebar',
					}
					return (
						<Button
							appearance='transparent'
							title={ label }
							icon={ <Icon.Safely { ...iconProps } /> }
							onClick={ () => {
								history.push( location )
							} }
							onKeyDown={ e => {
								if ( e.keyCode === DOWN ) {
									moveDown()
									e.preventDefault()
								}
								if ( e.keyCode === UP ) {
									moveUp()
									e.preventDefault()
								}
							} }
						>
							{ label }
						</Button>
					)
				} }
			</App.List>
		</SidebarSection>
	)
}

const ShortcutsSection = () => {

	const shortcuts = [
		{
			label: __( 'WordPress Admin', 'fl-assistant' ),
			href: '/wp-admin',
			icon: Icon.WordPress
		},
	]
	if ( 1 > shortcuts.length ) {
		return null
	}
	return (
		<SidebarSection
			title="Shortcuts"
			className="fl-asst-home-shortcut-list"
		>
			<ul>
				{ shortcuts.map( ( {
					label,
					href,
					icon: ShortcutIcon = Icon.Placeholder
				} ) => {
					return (
						<li key={ href }>
							<Button
								href={ href }
								target="_blank"
								appearance="transparent"
								icon={ <ShortcutIcon /> }
							>
								{ label }
							</Button>
						</li>
					)
				} ) }
			</ul>
		</SidebarSection>
	)
}

export default Shell
