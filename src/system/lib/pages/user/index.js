import React from 'fl-react'
import { __ } from '@wordpress/i18n'
import { getSystemConfig, useSystemState, getSystemActions } from 'store'
import { Page, Form, Control } from 'lib'

export const User = ( { location } ) => {
	const defaultItem = {
		id: null,
		url: '',
		displayName: '',
		email: '',
	}
	const item = 'undefined' !== typeof location.state.item ? location.state.item : defaultItem
	const { id, url, displayName, email } = item

	const { currentUser } = getSystemConfig()
	const isYou = currentUser.id === id

	const Header = () => (
		<Page.TitleCard title={ item.displayName }>
			{item.email}
		</Page.TitleCard>
	)

	return (
		<Page
			shouldPadSides={ false }
			title={ isYou ? __( 'Your Profile' ) : __( 'Edit User' ) }
			header={ <Header /> }
		>
			<Form>
				<AuthorArchiveSection url={ url } />

				<Form.Section label={ __( 'Basic Info' ) } handle="basic-info">
					<Form.Item label={ __( 'First Name' ) } labelFor="firstName" placement="beside">
						<input type="text" id="firstName" placeholder={ __( 'First Name' ) } />
					</Form.Item>

					<Form.Item label={ __( 'Last Name' ) } labelFor="lastName" placement="beside">
						<input type="text" id="lastName" placeholder={ __( 'Last Name' ) } />
					</Form.Item>

					<Form.Item label={ __( 'Display Name' ) } placement="beside">{displayName}</Form.Item>

					<Form.Item label={ __( 'Email Address' ) } placement="beside">{email}</Form.Item>
				</Form.Section>

				{ isYou && <AssistantPreferencesSection /> }

			</Form>
		</Page>
	)
}

const AuthorArchiveSection = ( { url } ) => {

	if ( ! url ) {
		return null
	}

	return (
		<Form.Section label={ __( 'Author Archive' ) } handle="author-archive">
			<Form.Item>
				<Control.URL url={ url } />
			</Form.Item>
		</Form.Section>
	)
}

const AssistantPreferencesSection = () => {
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
		<Form.Section label={ __( 'Assistant Preferences' ) } handle="assistant-prefs">
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
		</Form.Section>
	)
}
