import React from 'fl-react'
import {Button, Nav, Icon} from 'assistant/lib'
import { cssPrefixer } from "../../lib";
import './avatar-bar.scss'
import {__} from "@wordpress/i18n";

export const AvatarBar = (props) => {

    const {users} = props

    const c = cssPrefixer('fl-asst-users-avatar-bar')

    const generateAvatars = () => {
        let children = []
        for (let i = 0; i < users.length; i++) {
            children.push(<AvatarBar.Avatar key={i} user={users[i]}></AvatarBar.Avatar>)
        }

        return children
    }

    return (
        <div className="fl-asst-users-avatar-bar">
            <h2 className={c('title')}>{ __('WordPress Users') }</h2>
            <div className={c('users')}>
                {generateAvatars()}
                <Button className="fl-asst-avatar-button" to="/fl-users/invite">
                    <Icon.Plus/>
                </Button>
            </div>
            <div className="fl-asst-users-avatar-bar-show-all">
                <Button to="/fl-users/search">{ __('Show All Users') }</Button>
            </div>
        </div>
    )
}

AvatarBar.Avatar = (props) => {

    const {user} = props
    return (
        <div className="fl-asst-users-avatar-bar-avatar">
            <div className="avatar">
                <Nav.Link to={`/fl-users/user/${user.id}`}>
                    <img src={user.thumbnail} alt={user.displayName}/>
                </Nav.Link>
            </div>
            <div className="username">
                <Nav.Link to={`/fl-users/user/${user.id}`}>
                    {user.displayName}
                </Nav.Link>
            </div>
        </div>
    )
}
