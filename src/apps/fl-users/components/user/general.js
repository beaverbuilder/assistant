import React, { useEffect, useState } from 'fl-react'
import { Page, Form } from 'assistant/lib'
import { __ } from '@wordpress/i18n'
import { isEmpty } from 'lodash'

export const GeneralTab = ( props ) => {

	const publicDisplayOptions = ( user ) => {
		const options = []


		options.push( { value: 'nickname', label: user.nickname } )
		options.push( { value: 'username', label: user.username } )

		if ( ! isEmpty( user.firstName ) ) {
			options.push( { value: 'firstname', label: user.firstName } )
		}

		if ( ! isEmpty( user.lastName ) ) {
			options.push( { value: 'lastname', label: user.lastName } )
		}

		if ( ! isEmpty( user.firstName ) && ! isEmpty( user.lastName ) ) {
			options.push( { value: 'firstlast', label: `${user.firstName} ${user.lastName}` } )
			options.push( { value: 'lastfirst', label: `${user.lastName} ${user.firstName}` } )
		}

		if ( ! isEmpty( user.displayName ) ) {
			options.push( { value: 'displayname', label: user.displayName } )
		}

		return options
	}

	const { user } = props

	const onFormChange = () => {

	}

	console.log( 'initialFormState', user )

	const [ state, setValue ] = Form.useFormState( {
		content: '',
		date: new Date(),
		displayName: '',
		editUrl: '',
		email: '',
		firstName: '',
		id: null,
		lastName: '',
		nicename: '',
		nickname: '',
		thumbnail: '',
		title: '',
		url: '',
		username: '',
		website: '',
	}, onFormChange )


	useEffect( () => {
		for ( let [ key, value ] of Object.entries( user ) ) {
			setValue( key, value )
		}
		console.log( 'state', state )
	}, [ user ] )

	return (
		<Form>
			<Form.Section label={ __( 'Name' ) }>
				<Form.Item label={ __( 'First Name' ) } labelFor="firstName" isRequired={ true } placement="beside">
					<input
						id="firstName"
						type="text"
						required={ true }
						placeholder={ __( 'First Name' ) }
						value={ state.firstName }
						onChange={ e => setValue( 'firstName', e.target.value ) }
					/>
				</Form.Item>
				<Form.Item label={ __( 'Last Name' ) } labelFor="lastName" isRequired={ true } placement="beside">
					<input
						id="lastName"
						type="text"
						required={ true }
						placeholder={ __( 'Last Name' ) }
						value={  state.lastName }
						onChange={ e => setValue( 'lastName', e.target.value ) }
					/>
				</Form.Item>
				<Form.Item label={ __( 'Nickname' ) } labelFor="nickname" isRequired={ true } placement="beside">
					<input
						id="nickname"
						type="text"
						required={ true }
						placeholder={ __( 'Nickname' ) }
						value={ state.nickname }
						onChange={ e => setValue( 'nickname', e.target.value ) }
					/>
				</Form.Item>
				<Form.Item label={ __( 'Display As' ) } labelFor="nickname" isRequired={ true } placement="beside">
					<select
						id="displayName"
						value={ state.displayName }
						onChange={ e => setValue( 'displayName', e.target.value ) }
						style={ { width: '150px' } }>
						{/* @todo replace user with state */}
						{publicDisplayOptions( state ).map( option => {
							return ( <option key={ option.value } value={ option.value }>{option.label}</option> )
						} )}
					</select>
				</Form.Item>
			</Form.Section>
			<Form.Section label={ __( 'Contact Info' ) }>
				<Form.Item label={ __( 'Email Address' ) } labelFor="email" isRequired={ true } placement="beside">
					<input
						id="email"
						type="text"
						required={ true }
						placeholder={ __( 'yourname@site.com' ) }
						value={ state.email }
						onChange={ e => setValue( 'email', e.target.value ) }
					/>
				</Form.Item>
				<Form.Item label={ __( 'Website' ) } labelFor="website" isRequired={ true } placement="beside">
					<input
						id="website"
						type="text"
						required={ true }
						placeholder={ __( 'htpp://yoursite.com' ) }
						value={ state.website }
						onChange={ e => setValue( 'website', e.target.value ) }
					/>
				</Form.Item>
				<Form.Item label={ __( 'Biography' ) } labelFor="content" isRequired={ true }>
					<textarea
						id="content"
						required={ true }
						value={ state.content }
						onChange={ e => setValue( 'content', e.target.value ) }
						style={ { 'minHeight': '100px' } }
					/>
				</Form.Item>
			</Form.Section>
			{/*<Form.Section label={__('User Data')}>*/}
			{/*    <pre>{JSON.stringify(publicDisplayOptions(user), null, 4)}</pre>*/}
			{/*</Form.Section>*/}
		</Form>
	)
}
