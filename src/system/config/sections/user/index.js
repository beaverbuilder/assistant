import React from 'fl-react'
import { Form, Control } from 'lib'
import { useSystemState, getSystemActions } from 'store'
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
				<Control.URL url={ user.url } />
			</Form.Item>
		)
	},
} )

registerSection( 'fl-user-assistant-prefs', {
	label: __( 'Assistant Preferences' ),
	location: {
		type: 'user',
	},
	isEnabled: ( { isYou } ) => isYou,

	render: () => {
		const { window } = useSystemState()
		const { setWindow } = getSystemActions()

		const showWhenHidden = 'undefined' !== typeof window.hiddenAppearance ? window.hiddenAppearance : ''
		const whenHiddenOptions = {
			'': __( 'Button (Default)' ),
			'admin_bar': __( 'Admin Bar Item' )
		}
		const handleChange = ( key, value ) => {
			switch ( key ) {
			case 'showWhenHidden':
				if ( value !== window.hiddenAppearance ) {
					setWindow( { ...window, hiddenAppearance: value } )
				}
			}
		}

		return (
			<>
			<Form.Item>
				<p>{__( 'These options pertain specifically to the Assistant panel.' )}</p>
			</Form.Item>

			<Form.Item label={ __( 'Show in Admin' ) } >
				<label>
					<input type="checkbox" id="showInAdmin" checked={ true } onChange={ () => {} } />
					<span>{__( 'Show Assistant UI in the WordPress Admin' )}</span>
				</label>
			</Form.Item>

			<Form.Item label={ __( 'Show when hidden' ) } labelFor="showWhenHidden" placement="beside" >
				<select id="showWhenHidden" value={ showWhenHidden } onChange={ e => handleChange( 'showWhenHidden', e.target.value ) }>
					{ Object.entries( whenHiddenOptions ).map( ( [ key, value ], i ) => (
						<option key={ i } value={ key }>{value}</option>
					) )}
				</select>
			</Form.Item>
			</>
		)
	},
} )
