import React from 'fl-react'
import { getSystemActions, getSystemConfig, useSystemState } from 'store'
import { Nav, Button, Icon } from 'lib'
import { __ } from '@wordpress/i18n'
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
