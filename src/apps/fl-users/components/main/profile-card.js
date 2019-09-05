import React from 'fl-react'
import { Button, Page } from 'assistant/lib'
import { __ } from '@wordpress/i18n'
import { Well } from '../well'
import './profile-card.scss'

export const ProfileCard = ( props ) => {
	const { user } = props

	return (
		<div className="fl-asst-users-profile">
			<Well className="card">
				<div className="avatar-row">
					<div className="avatar">
						<img src={ user.thumbnail }/>
					</div>
					<div className="info">
						<div>
							<div className="username">{user.displayName}</div>
							<div className="email">{user.email}</div>
						</div>
					</div>
				</div>

				<Page.Toolbar style={ { padding: 'var(--fl-asst-inner-space) 0 0' } }>
					<Button to={ `/fl-users/user/${user.id}` }>{__( 'Edit' )}</Button>
					<Button href={ user.url }>{__( 'Author Page' )}</Button>
					<Button href={ user.editUrl }>{__( 'Edit in Admin' )}</Button>
				</Page.Toolbar>
			</Well>
		</div>
	)
}
