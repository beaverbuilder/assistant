import React from 'fl-react'
import { Button } from 'assistant/lib'
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

				<Button.Group className="actions">
					<Button to={ `/fl-users/user/${user.id}` }>Edit</Button>
					<Button href={ user.url }>Author Page</Button>
					<Button href={ user.editUrl }>Edit in Admin</Button>
				</Button.Group>
			</Well>
		</div>
	)
}
