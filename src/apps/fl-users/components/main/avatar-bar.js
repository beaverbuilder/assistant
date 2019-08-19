import React from 'fl-react'
import {Button, Nav, Icon} from 'assistant/lib'
import './avatar-bar.scss'

export const AvatarBar = (props) => {

    const {users} = props

    const generateAvatars = () => {
        let children = []
        for (let i = 0; i < users.length; i++) {
            children.push(<AvatarBar.Avatar key={i} user={users[i]}></AvatarBar.Avatar>)
        }

        return children
    }

    return (
        <div className="fl-asst-users-avatar-bar">
            <div className="fl-asst-users-avatar-bar-title">WordPress Users</div>
            <div className="fl-asst-users-avatar-bar-users">
                {generateAvatars()}
                <div className="fl-asst-users-avatar-bar-add-user">
                    <Icon.Plus/>
                </div>
            </div>
            <div className="fl-asst-users-avatar-bar-show-all">
                <Button to="/fl-users/search">Show All Users</Button>
            </div>
        </div>
    )
}

AvatarBar.Avatar = (props) => {

    const {user} = props
    return (
        <Nav.Link
            className="fl-asst-users-avatar-bar-avatar"
            to={`/fl-users/user/${user.id}`}>
            <img src={user.thumbnail} alt=""/>

            <div>
                {user.displayName}
            </div>
        </Nav.Link>
    )
}
