import React from 'fl-react'
import { Form, Control, Button } from 'assistant/lib'
import { __ } from '@wordpress/i18n'

export const PreferencesTab = ( props ) => {
	const { user } = props

	const [ state, setValue ] = Form.useFormState( {
		showAdminBar: true,
		password: null,
		darkmode: false,
		uiposition: 'topright'
	}, () => {})

	return (
		<Form>
			<Form.Section label={ __( 'Preferences' ) }>
				<Form.Item label={ __( 'Show Admin Bar?' ) } labelFor='adminbar' placement="beside">
					<Control.Toggle value={ state.showAdminBar }/>
				</Form.Item>
				<Form.Item label={ __( 'New Password' ) } labelFor='password' placement="beside">
					<Button>Generate Password</Button>
				</Form.Item>
				<Form.Item label={ __( 'Other Sessions' ) } labelFor='logout' placement="beside">
					<Button>Log Out Everywhere</Button>
				</Form.Item>
			</Form.Section>
			<Form.Section label={ __( 'Assistant' ) }>
				<Form.Item>
					<p>{__( 'These preferences apply specifically to the Assistant user interface (not the WordPress Admin)' )}</p>
				</Form.Item>
				<Form.Item label={ __( 'Dark Appearance' ) } labelFor='darkmode' placement="beside">
					<Control.Toggle/>
				</Form.Item>
				<Form.Item label={ __( 'Anchor UI To' ) } labelFor={ 'uiposition' } placement="beside">
					<select id="uiposition" name="uiposition" style={ { minWidth: '140px' } }>
						<option value="topright">Top Right</option>
						<option value="topleft">Top Left</option>
						<option value="bottomright">Bottom Right</option>
						<option value="bottomleft">Bottom Left</option>
					</select>
				</Form.Item>
			</Form.Section>
		</Form>
	)
}
