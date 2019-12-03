import React from 'react'
import { __ } from '@wordpress/i18n'
import { Page } from 'fluid/ui'
import { Form, Nav } from 'assistant/ui'

export const App = ( { match } ) => (
	<Nav.Switch>
		<Nav.Route path={ `${match.url}/` } component={ Main } />
	</Nav.Switch>
)

const Main = ( { match } ) => {
	const { FormTabs } = Form.useForm( {
		tabs: {
			general: {
				label: __( 'General' ),
				path: match.url,
				exact: true,
				sections: {
					info: {
						label: __( 'Info' ),
						fields: {
							name: {
								label: __( 'Name' ),
								type: 'text',
							}
						},
					},
				},
			},
			edit: {
				label: __( 'Edit' ),
				path: `${ match.url }/edit`,
				sections: {
					test: {
						label: __( 'Test' ),
						fields: {
							email: {
								label: __( 'Email' ),
								type: 'text',
							}
						},
					},
				},
			},
		},
	} )

	return <FormTabs />
}
