import { __ } from '@wordpress/i18n'
import React from 'fl-react'
import { Page, Form, Button, Control } from 'assistant/lib'
import { Well } from '../components/well'
import { Avatar } from '../components/avatar'
import { cssPrefixer } from '../lib'
import './invite.scss'

export const Invite = () => {

	const c = cssPrefixer( 'fl-asst-user-invite' )

	const [ state, setValue ] = Form.useFormState( {
		username: '',
		email: '',
		firstName: '',
		lastName: '',
		website: '',
		role: 'subscriber',
		password: '',
		displayName: ''
	} )

	return (
		<Page shouldPadSides={ true } title={ __( 'Invite New User' ) }>
			<Well className={ c( 'well' ) }>
				<div className={ c( 'user' ) }>
					<div className={ c( 'avatar' ) }>
						<Avatar email={ state.email } size={ 100 }/>
					</div>
					<div className={ c( 'user-info' ) }>
						<div className="username">{state.username}</div>
						<div className="email">{state.email}</div>
					</div>
				</div>
			</Well>
			<Form autoComplete="off">
				<Form.Section>
					<Form.Item label={ __( 'Username' ) }
						labelFor="username"
						isRequired={ true }
						placement="beside">
						<input
							id="username"
							type="text"
							required={ true }
							placeholder={ __( 'Username' ) }
							value={ state.username }
							onChange={ e => setValue( 'username', e.target.value ) }
						/>
					</Form.Item>
					<Form.Item label={ __( 'Email' ) }
						labelFor="username"
						isRequired={ true }
						placement="beside">
						<input
							id="email"
							type="text"
							required={ true }
							placeholder={ __( 'Email' ) }
							value={ state.email }
							onChange={ e => setValue( 'email', e.target.value ) }
						/>
					</Form.Item>
					<Form.Item label={ __( 'First Name' ) }
						labelFor="firstName"
						isRequired={ true }
						placement="beside">
						<input
							id="firstName"
							type="text"
							required={ true }
							placeholder={ __( 'First Name' ) }
							value={ state.firstName }
							onChange={ e => setValue( 'firstName', e.target.value ) }
						/>
					</Form.Item>
					<Form.Item label={ __( 'Last Name' ) }
						labelFor="lastName"
						isRequired={ true }
						placement="beside">
						<input
							id="lastName"
							type="text"
							required={ true }
							placeholder={ __( 'Last Name' ) }
							value={ state.firstName }
							onChange={ e => setValue( 'lastName', e.target.value ) }
						/>
					</Form.Item>
					<Form.Item label={ __( 'Website' ) }
						labelFor="website"
						isRequired={ true }
						placement="beside">
						<input
							id="website"
							type="text"
							required={ true }
							placeholder={ __( 'Website' ) }
							value={ state.firstName }
							onChange={ e => setValue( 'website', e.target.value ) }
						/>
					</Form.Item>
				</Form.Section>
				<Form.Section label={ __( 'Access Info' ) }>
					<Form.Item label={ __( 'Send Notification?' ) } labelFor='notify' placement="beside">
						<Control.Toggle/>
					</Form.Item>
					<Form.Item label={ __( 'Role' ) }
						labelFor="role"
						isRequired={ true }
						placement="beside">
						<select
							id="role"
							required={ true }
							placeholder={ __( 'Subscriber' ) }
							value={ state.role }
							onChange={ e => setValue( 'role', e.target.value ) }
							style={ { width: '150px' } }
						>
							<option value="subscriber">Subscriber</option>
							<option value="editor">Editor</option>
							<option value="admin">Admin</option>
						</select>
					</Form.Item>
					<Form.Item label={ __( 'Password' ) }
						labelFor="password"
						isRequired={ true }
						placement="beside">
						<input
							id="password"
							type="password"
							required={ true }
							placeholder={ __( 'Show Password' ) }
							value={ state.firstName }
							onChange={ e => setValue( 'password', e.target.value ) }
						/>
					</Form.Item>
					<Form.Footer>
						<Button>Cancel</Button>
						<Button>Invite User</Button>
					</Form.Footer>
				</Form.Section>
			</Form>

		</Page>
	)
}
