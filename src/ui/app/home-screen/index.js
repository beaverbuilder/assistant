import React from 'fl-react'
import { __ } from 'assistant/i18n'
import { useSystemState } from 'assistant/data'
import { Page, Nav } from 'assistant/ui'
import { react as reactUtils } from 'assistant/utils'
const { useInitialFocus } = reactUtils

export const HomeScreen = () => {
	const { apps, appOrder } = useSystemState()
	const focusRef = useInitialFocus()
	let didSetFocusRef = false

	return (
		<Page shouldPadTop={true} shouldPadSides={false} shouldShowHeader={false}>

			<Page.Toolbar>
				<Nav.ButtonLink to="/fl-search">{__( 'Search' )}</Nav.ButtonLink>
			</Page.Toolbar>

			<div className="app-grid">
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

					return (
						<Nav.Link to={location} className="app-grid-item" key={i} innerRef={ref}>
							<div className="fl-asst-app-icon" style={style}>
								{ 'function' === typeof app.icon && app.icon( {} ) }
							</div>
							<label>{app.label}</label>
						</Nav.Link>
					)
				} )}
			</div>
		</Page>
	)
}
