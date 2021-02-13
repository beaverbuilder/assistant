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
	...rest
} ) => {

	const classes = c( 'fluid-page', 'fl-asst-home-shell', className )
	return (
		<div className={ classes } { ...rest }>
			<nav className="fl-asst-home-shell-sidebar">
				<div
					style={ {
						minHeight: 80,
						display: 'flex',
						alignItems: 'center',
						padding: 20
					} }
				>
					<Icon.PencilOutline
						style={ {
							marginRight: 10
						} }
					/>
					{ __( 'Assistant' ) }
				</div>
				<AppsSection />
			</nav>
			<div className="fl-asst-home-shell-content">
				{children}
			</div>
		</div>
	)
}

const AppsSection = () => {
	const history = useHistory()
	return (
		<div className="fl-asst-home-shell-sidebar-section">
			<div
				style={ {
					padding: '5px var(--fluid-med-space)'
				} }
			>{ __( 'Apps', 'fl-assistant' ) }</div>
			<App.List limit={ 5 }>
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
		</div>
	)
}

export default Shell
