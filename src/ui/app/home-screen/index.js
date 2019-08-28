import React from 'fl-react'
import { __ } from 'assistant/i18n'
import { useSystemState, getSystemConfig } from 'assistant/data'
import { Page, Nav, Button } from 'assistant/ui'
import { useInitialFocus } from 'assistant/utils/react'
import './style.scss'

export const HomeScreen = () => {
	const { apps, appOrder, window } = useSystemState()
	const focusRef = useInitialFocus()
	let didSetFocusRef = false

	return (
		<Page shouldPadSides={ false } shouldShowHeader={ false }>

			<Page.Section>
				<Nav.ButtonLink to="/fl-search">{__( 'Search' )}</Nav.ButtonLink>
			</Page.Section>

			<CurrentlyViewingSection />

			<Page.Section label={__('Apps')} handle="apps" shouldPadSides={false}>
			<div className="fl-asst-app-grid">
				{ appOrder.map( ( handle, i ) => {
					const app = apps[handle]

					if ( 'undefined' === typeof app || ! app.shouldShowInAppList ) {
						return
					}

					const location = {
						pathname: `/${handle}`,
						state: app,
					}

					const style = {}
					if ( 'undefined' !== typeof app.accent ) {
						style['--fl-asst-accent-color'] = app.accent.color
						style.backgroundColor = 'var(--fl-asst-accent-color)'
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
								{ 'function' === typeof app.icon && app.icon( iconProps ) }
							</div>
							<label>{app.label}</label>
						</Nav.Link>
					)
				} )}
			</div>
			</Page.Section>
		</Page>
	)
}

const CurrentlyViewingSection = () => {
	const { currentPageView } = getSystemConfig()
	const { name, type } = currentPageView
	return (
		<Page.Section label={__('Currently Viewing')} handle="currently-viewing">
			<div className="fl-asst-currently-viewing-summary">
				{ type && <div className="fl-asst-pretitle">{type}</div> }
				<div className="fl-asst-title">{name}</div>
			</div>
		</Page.Section>
	)
}
