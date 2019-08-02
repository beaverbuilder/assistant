import React, { useState, useRef, useEffect } from 'fl-react'
import { __ } from 'assistant/i18n'
import { useSystemState } from 'assistant/data'
import { Page, Nav, Button } from 'assistant/ui'
import { react as reactUtils } from 'assistant/utils'
const { useInitialFocus } = reactUtils

export const HomeScreen = () => {
	const { apps, appOrder } = useSystemState()
	const initialFocusEl = useInitialFocus()

	return (
		<Page shouldPadTop={true} shouldPadSides={false} shouldShowHeader={false}>

            <Page.Toolbar>
                <Button>{__('Search')}</Button>
            </Page.Toolbar>

			<div className="app-grid">
				{ appOrder.map( ( handle, i ) => {
					const app = apps[handle]
					const location = {
						pathname: `/${handle}`,
						state: app,
					}
					const style = {}
					if ( 'undefined' !== typeof app.accent ) {
						style['--fl-asst-accent-color'] = app.accent.color
						style.backgroundColor = 'var(--fl-asst-accent-color)'
					}

					return (
						<Nav.Link to={location} className="app-grid-item" key={i} innerRef={ i === 0 ? initialFocusEl : null }>
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
