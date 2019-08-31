import React from 'fl-react'
import { __ } from 'assistant/i18n'
import { useSystemState, getSystemActions } from 'assistant/data'
import { Page, Nav } from 'assistant/ui'
import { useInitialFocus } from 'assistant/utils/react'
import './style.scss'

const { registerSection } = getSystemActions()

registerSection( 'fl-home-apps', {
	label: __('Apps'),
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
		)
	},
} )

export const HomeScreen = () => {
	return (
		<Page shouldPadSides={ false } shouldShowHeader={ false }>

			<Page.RegisteredSections
				location={ { type: 'home' } }
				data={ {} }
			/>
		</Page>
	)
}
