import React from 'fl-react'
import {Toolbar, Button} from 'assistant/lib'

import './profile-card.scss'

export const ProfileCard = (props) => {
    const { user } = props

    return (
        <div className="fl-asst-users-profile">
            <div className="fl-asst-users-profile-title">
                Your Profile
            </div>
            <div className="fl-asst-users-profile-card">
                <div className="fl-asst-users-profile-avatar-row">
                    <div className="fl-asst-users-profile-avatar">
                        <img src={user.thumbnail}/>
                    </div>
                    <div className="fl-asst-users-profile-info">
                        <div className="username">{user.displayName}</div>
                        <div className="email">{user.email}</div>
                    </div>
                </div>

                <Button.Group>
                    <Button to={`/fl-users/user/${user.id}`}>Edit</Button>
                    <Button href={user.url}>Author Page</Button>
                    <Button href={user.editUrl}>Edit in Admin</Button>
                </Button.Group>
            </div>
        </div>
    )
}

