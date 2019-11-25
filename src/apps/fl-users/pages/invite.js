import { __ } from '@wordpress/i18n'
import React from 'react'
import { Page, Form, Button, Control } from 'assistant/ui'
import { Avatar } from '../components/avatar'
import './invite.scss'


export const Invite = ( ) => {

	const defaultValues = {
		username: 'user_123',
		email: '',
		firstName: '',
		lastName: '',
		website: '',
		role: 'subscriber',
		password: '',
		displayName: '',
		sendNotification: true,
	}

	const {
		form,
		values,
		fields,
		submitForm,
		resetForm,
	} = Form.useForm( {
		username: {
			label: __( 'Username' ),
			id: 'username',
			labelPlacement: 'beside',
			required: true,
		},
		email: {
			label: __( 'Email Address' ),
			id: 'email',
			type: 'email',
			labelPlacement: 'beside',
			required: true,
		},
		firstName: {
			label: __( 'First Name' ),
			id: 'firstName',
			labelPlacement: 'beside',
		},
		lastName: {
			label: __( 'Last Name' ),
			id: 'lastName',
			labelPlacement: 'beside',
		},
		website: {
			label: __( 'Website' ),
			id: 'website',
		},
		role: {
			label: __( 'User Role' ),
			id: 'role',
			labelPlacement: 'beside',
			required: true,
			options: {
				'admin': __( 'Administrator' ),
				'editor': __( 'Editor' ),
				'author': __( 'Author' ),
				'contributor': __( 'Contributor' ),
				'subscriber': __( 'Subscriber' ),
			},
		},
		sendNotification: {
			label: __( 'Send Notification' ),
			id: 'sendNotification',
			labelPlacement: 'beside',
		},
		password: {
			label: __( 'Password' ),
			type: 'password',
			required: true,
		}
	}, {}, defaultValues )

	const {
		username,
		email,
		firstName,
		lastName,
		website,
		role,
		password,
		sendNotification
	} = fields

	const Footer = () => {
		return (
			<Page.Toolbar>
				<Button onClick={ resetForm }>{__( 'Cancel' )}</Button>
				<Button onClick={ submitForm }>{__( 'Invite' )}</Button>
			</Page.Toolbar>
		)
	}

	return (
		<Page
			shouldPadSides={ false }
			title={ __( 'Invite New User' ) }
			footer={ <Footer /> }
		>
			<Page.TitleCard>
				<div className="user">
					<div className="avatar">
						<Avatar email={ values.email } />
					</div>
					<div className="user-info">
						<div className="username">{values.username}</div>
						<div className="email">{values.email}</div>
					</div>
				</div>
			</Page.TitleCard>

			<Form { ...form }>

				<Page.Section>
					<Form.TextItem { ...username } />
					<Form.TextItem { ...email } />
					<Form.TextItem { ...firstName } />
					<Form.TextItem { ...lastName } />
					<Form.TextItem { ...website } />
				</Page.Section>

				<Page.Section label={ __( 'Access Info' ) }>

					<Form.Item { ...sendNotification } placement={ sendNotification.labelPlacement }>
						<Control.Toggle
							value={ sendNotification.value }
							onChange={ sendNotification.onChange }
						/>
					</Form.Item>

					<Form.SelectItem { ...role } />
					<Form.TextItem { ...password } />
				</Page.Section>
			</Form>

		</Page>
	)
}
