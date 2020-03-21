import React, { useContext } from 'react'
import { getSystemActions, getSystemConfig, useSystemState, useAppList } from 'data'
import { Button, Icon, App } from 'ui'
import { __ } from '@wordpress/i18n'
import { useInitialFocus } from 'utils/react'
import './style.scss'

const { registerSection } = getSystemActions()

registerSection( 'fl-asst-quick-actions', {
	location: {
		type: 'home',
	},
	padX: false,
	render: () => {
		const { environment } = useContext( App.Context )
		const { adminURLs } = getSystemConfig()

		const dashURL = 'undefined' !== typeof adminURLs.dashboard ? adminURLs.dashboard : '/wp-admin'

		const { appearance } = useSystemState()
		const { setBrightness } = getSystemActions()
		const toggleBrightness = () => 'light' === appearance.brightness ? setBrightness( 'dark' ) : setBrightness( 'light' )

		return (
			<div className="fl-asst-quick-actions">
				<Button to="/fl-search" appearance="elevator" title={ __( 'Search' ) }>
					<Icon.Search />
				</Button>
				<Button href={ dashURL } appearance="elevator" title={ __( 'Go to Admin' ) }>
					<span className="dashicons dashicons-wordpress-alt"></span>
				</Button>
				{ 'beaver-builder' !== environment && (
					<Button onClick={ toggleBrightness } appearance="elevator" title={ __( 'Toggle UI Brightness' ) }>
						<Icon.Brightness />
					</Button>
				)}
				<Button to={ {
					pathname: '/fl-content/post/new',
					state: { detailBaseUrl: '/fl-content/post' }
				} } appearance="elevator" title={ __( 'Create Post' ) }>
					<Icon.Plus />
				</Button>
			</div>
		)
	},
} )

registerSection( 'fl-home-currently-viewing', {
	label: false,
	location: {
		type: 'home',
	},
	padY: false,
	render: () => {
		const { currentPageView } = getSystemConfig()
		const { name, intro, actions } = currentPageView

		const style = {
			background: 'var(--fluid-box-background)',
			borderRadius: 20,
			padding: 'var(--fluid-lg-space)',
		}

		return (
			<>
			<div
				className="fl-asst-currently-viewing-summary"
				style={ style }
			>
				{ intro && <div className="fl-asst-pretitle">{intro}</div> }
				<div className="fl-asst-title">{name}</div>

			</div>
			{ Array.isArray( actions ) && 0 < actions.length &&
			<Button.Group appearance="buttons">{ Button.renderActions( actions ) }</Button.Group> }
			</>
		)
	},
} )

registerSection( 'fl-home-apps', {
	label: __( 'Apps' ),
	location: {
		type: 'home',
	},
	padX: false,
	render: () => {
		const apps = useAppList()
		const focusRef = useInitialFocus()
		let didSetFocusRef = false

		return (
			<div className="fl-asst-app-grid">
				{ apps.map( ( app, i ) => {
					const { handle, icon, label, accent } = app

					const location = {
						pathname: `/${handle}`,
						state: app,
					}

					const style = {}
					if ( 'undefined' !== typeof accent ) {
						style['--fl-asst-accent-color'] = accent.color
						style.color = 'var(--fl-asst-accent-color)'
					}

					let ref = null
					if ( ! didSetFocusRef ) {
						ref = focusRef
						didSetFocusRef = true
					}

					return (
						<Button
							to={ location }
							className="fl-asst-app-grid-item"
							key={ i }
							innerRef={ ref }
							appearance="transparent"
						>
							<div className="fl-asst-app-icon" style={ style }>
								{ 'function' === typeof icon && icon( { context: 'grid' } ) }
							</div>
							<label>{label}</label>
						</Button>
					)
				} )}
			</div>
		)
	},
} )
