import React, { useState } from 'fl-react'
import { __ } from 'assistant/i18n'
import { useSystemState } from 'assistant/data'
import { Page, Icon, Nav } from 'assistant/ui'

export const HomeScreen = () => {
	const { apps, appOrder } = useSystemState()
    const [term, setTerm] = useState()
	return (
		<Page shouldPadTop={true} shouldPadSides={false} shouldShowHeader={false}>

            <Page.Toolbar>
                <input
                    type="search"
                    value={term}
                    onChange={ e => setTerm( e.target.value ) }
                    placeholder={ __( 'Search' ) }
                />
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
						<Nav.Link to={location} className="app-grid-item" key={i}>
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
