import React from 'react'
import { getSystemActions, getSystemConfig, useSystemState } from 'store'
import { Nav, Button, Icon } from 'lib'
import { __ } from '@wordpress/i18n'
import { useInitialFocus } from 'utils/react'
import './style.scss'

const { registerSection } = getSystemActions()

registerSection( 'fl-asst-quick-actions', {
	location: {
		type: 'home',
	},
	render: () => {
		const { adminURLs } = getSystemConfig()

		const dashURL = 'undefined' !== typeof adminURLs.dashboard ? adminURLs.dashboard : '/wp-admin'

		const { appearance } = useSystemState()
		const { setBrightness } = getSystemActions()
		const toggleBrightness = () => 'light' === appearance.brightness ? setBrightness( 'dark' ) : setBrightness( 'light' )

		return (
			<div className="fl-asst-quick-actions">
				<Nav.ButtonLink to="/fl-search">
					<Icon.Search />
				</Nav.ButtonLink>
				<Button href={ dashURL }>
					<span className="dashicons dashicons-wordpress-alt"></span>
				</Button>
				<Button onClick={ toggleBrightness }>
					<Icon.Brightness />
				</Button>
				<Nav.ButtonLink to={ {
					pathname: '/fl-content/post/new',
					state: { detailBaseUrl: '/fl-content/post' }
				} }>
					<Icon.Plus />
				</Nav.ButtonLink>
			</div>
		)
	},
} )

registerSection( 'fl-home-currently-viewing', {
	label: __( 'Currently Viewing' ),
	location: {
		type: 'home',
	},
	render: () => {
		const { currentPageView } = getSystemConfig()
		const { name, type, actions } = currentPageView

		return (
			<>
				<div className="fl-asst-currently-viewing-summary">
					{ type && <div className="fl-asst-pretitle">{type}</div> }
					<div className="fl-asst-title">{name}</div>
					{ Array.isArray( actions ) && 0 < actions.length &&
					<Button.Group appearance="buttons">{ Button.renderActions( actions ) }</Button.Group> }
				</div>
			</>
		)
	},
} )

registerSection( 'fl-home-apps', {
	label: __( 'Apps' ),
	location: {
		type: 'home',
	},
	shouldPadSides: false,
	render: () => {
		const { apps, appOrder, window } = useSystemState()
		const focusRef = useInitialFocus()
		let didSetFocusRef = false

		return (
			<div className="fl-asst-app-grid">
				{ appOrder.map( ( handle, i ) => {
					const app = apps[handle]

					let icon = Icon.DefaultApp
					if ( 'function' === typeof app.icon ) {
						icon = app.icon
					}

					if ( 'undefined' === typeof app || ! app.shouldShowInAppList ) {
						return
					}

					const location = {
						pathname: `/${handle}`,
						state: app,
					}

					const style = {
						color: 'var(--fl-asst-secondary-surface-background)'
					}
					if ( 'undefined' !== typeof app.accent ) {
						style['--fl-asst-accent-color'] = app.accent.color
						style.color = 'var(--fl-asst-accent-color)'
					}

					let ref = null
					if ( ! didSetFocusRef ) {
						ref = focusRef
						didSetFocusRef = true
					}

					const size = 'mini' === window.size ? 50 : 60
					const iconProps = {
						width: size,
						height: size,
						windowSize: window.size,
						context: 'app-list',
					}

					return (
						<Nav.Link to={ location } className="fl-asst-app-grid-item" key={ i } innerRef={ ref }>
							<div className="fl-asst-app-icon" style={ style }>
								{ 'function' === typeof icon && icon( iconProps ) }
							</div>
							<label>{app.label}</label>
						</Nav.Link>
					)
				} )}
			</div>
		)
	},
} )
