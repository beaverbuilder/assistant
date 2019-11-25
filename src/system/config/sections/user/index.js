import React from 'react'
import { Form, Control } from 'ui'
import { getSystemActions } from 'data'
import { __ } from '@wordpress/i18n'

const { registerSection } = getSystemActions()

registerSection( 'fl-user-info', {
	location: {
		type: 'user',
	},
	render: ( { useForm } ) => {

		const { firstName, lastName, email, displayName } = useForm()

		return (
			<>
				<Form.TextItem { ...firstName } />
				<Form.TextItem { ...lastName } />
				<Form.TextItem { ...email } />
				<Form.TextItem { ...displayName } />
			</>
		)
	},
} )

registerSection( 'fl-user-url', {
	label: __( 'Author Archive' ),
	location: {
		type: 'user',
	},
	render: ( { user } ) => {
		return (
			<Form.Item>
				<Control.URL value={ user.url } />
			</Form.Item>
		)
	},
} )

registerSection( 'fl-user-prefs', {
	label: __( 'Preferences' ),
	location: {
		type: 'user',
		tab: 'preferences',
	},
	isEnabled: ( { isYou } ) => isYou,
	render: ( { useForm } ) => {

		const { showAdminBar } = useForm()

		return (
			<>
				<Form.CheckboxItem { ...showAdminBar } />
			</>
		)
	},
} )


registerSection( 'fl-user-assistant-prefs', {
	label: __( 'Assistant Preferences' ),
	location: {
		type: 'user',
		tab: 'preferences',
	},
	isEnabled: ( { isYou } ) => isYou,
	render: ( { useForm } ) => {

		const { showInAdmin, showWhenHidden } = useForm()

		return (
			<>
				<Form.Item>{__( 'These options pertain specifically to the Assistant panel.' )}</Form.Item>
				<Form.CheckboxItem { ...showInAdmin } />
				<Form.SelectItem { ...showWhenHidden } />
			</>
		)
	},
} )
