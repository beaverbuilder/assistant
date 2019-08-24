import {__} from '@wordpress/i18n'
import React from 'fl-react'
import {Toolbar, Button} from 'assistant/lib'
import {cssPrefixer} from "../../lib";
import {Well} from "../well";
import './profile-card.scss'

export const ProfileCard = (props) => {
    const {user} = props

    const c = cssPrefixer('fl-asst-users-profile')

    return (
        <div className="fl-asst-users-profile">
            <h2 className={c('title')}>{__('Your Profile')}</h2>
            <Well className={c('card')}>
                <div className={c('avatar-row')}>
                    <div className={c('avatar')}>
                        <img src={user.thumbnail}/>
                    </div>
                    <div className={c('info')}>
                        <div>
                            <div className="username">{user.displayName}</div>
                            <div className="email">{user.email}</div>
                        </div>
                    </div>
                </div>

                <Button.Group className={c('actions')}>
                    <Button to={`/fl-users/user/${user.id}`}>Edit</Button>
                    <Button href={user.url}>Author Page</Button>
                    <Button href={user.editUrl}>Edit in Admin</Button>
                </Button.Group>
            </Well>
        </div>
    )
}

