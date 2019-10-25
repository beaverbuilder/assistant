import { __ } from '@wordpress/i18n'
import React from 'react'
import { Button, Nav, Icon } from 'assistant/lib'
import './avatar-bar.scss'

export const AvatarBar = ( props ) => {
	const { users } = props

	return (
		<div className="fl-asst-users-avatar-bar">
			<div className="users">
				{ users.map( user => {
					return (
						<AvatarBar.Avatar key={ user.id } user={ user }></AvatarBar.Avatar>
					)
				} ) }
				<div className="user-avatar-item">
					<Button className="add-new-user-button" to="/fl-users/invite">
						<Icon.Plus/>
					</Button>
				</div>
			</div>
			<div className="show-all">
				<Button to="/fl-users/search">{ __( 'Show All Users' ) }</Button>
			</div>
		</div>
	)
}

AvatarBar.Avatar = ( props ) => {

	const { user } = props
	const editUrl = `/fl-users/user/${user.id}`

	const to = {
		pathname: editUrl,
		state: { item: user },
	}

	return (
		<div className="user-avatar-item">
			<div className="avatar">
				<Nav.Link to={ to }>
					<img src={ user.thumbnail } alt={ user.displayName }/>
				</Nav.Link>
			</div>
			<div className="username">
				<Nav.Link to={ to }>
					{user.displayName}
				</Nav.Link>
			</div>
		</div>
	)
}
