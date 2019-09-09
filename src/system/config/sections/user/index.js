import React from 'fl-react'
import { Form, Control } from 'lib'
import { getSystemActions } from 'store'
import { __ } from '@wordpress/i18n'

const { registerSection } = getSystemActions()

registerSection( 'fl-user-info', {
	label: __( 'Basic Info' ),
	location: {
		type: 'user',
	},
	render: ( { user } ) => {
		const { displayName, email } = user
		return (
			<>
				<Form.Item label={ __( 'First Name' ) } labelFor="firstName" placement="beside">
					<input type="text" id="firstName" placeholder={ __( 'First Name' ) } />
				</Form.Item>

				<Form.Item label={ __( 'Last Name' ) } labelFor="lastName" placement="beside">
					<input type="text" id="lastName" placeholder={ __( 'Last Name' ) } />
				</Form.Item>

				<Form.Item label={ __( 'Display Name' ) } placement="beside">{displayName}</Form.Item>

				<Form.Item label={ __( 'Email Address' ) } placement="beside">{email}</Form.Item>
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
