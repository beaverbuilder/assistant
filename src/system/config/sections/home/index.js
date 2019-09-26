import React from 'fl-react'
import { getSystemActions, getSystemConfig } from 'store'
import { Nav, Button } from 'lib'
import { __ } from '@wordpress/i18n'

const { registerSection } = getSystemActions()

registerSection( 'fl-home-search', {
	location: {
		type: 'home',
	},
	render: () => {
		return (
			<Nav.ButtonLink to="/fl-search" style={{ background: 'var(--fl-asst-secondary-surface-background)' }}>{__( 'Search' )}</Nav.ButtonLink>
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
					<div className="fl-asst-title" style={ { marginBottom: 10 } }>{name}</div>
					{ Array.isArray( actions ) && 0 < actions.length &&
					<Button.Group appearance="buttons">
						{ Button.renderActions( actions ) }
					</Button.Group> }
				</div>
			</>
		)
	},
} )
