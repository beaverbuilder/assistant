import React, {useEffect, useState} from 'fl-react'
import {Button} from 'assistant/lib'
import { isArray } from 'lodash'


import './summary.scss'

export const Summary = (props) => {
    const {user} = props


    const c = (names) => {
        if(isArray(names)) {
            return names.map((name) => {
                return `fl-asst-users-summary-user-panel-${names}`
            }).join()
        } else {
            return `fl-asst-users-summary-user-panel-${names}`
        }
    }

    return (
        <div className="fl-asst-users-summary-user-panel">
            <div className={c('badges')}>
                <div className={c('badge')}>
                    <img src={user.thumbnail} alt={user.displayName}/>
                </div>
                <div className={c('badge')}>
                    <div className="count">{user.posts}</div>
                    <div className="title">Posts</div>
                </div>
                <div className={c('badge')}>
                    <div className="count">{user.pages}</div>
                    <div className="title">Posts</div>
                </div>
            </div>
            <div className={c('info')}>
                <div className={c('display-name')}>
                    { user.displayName }
                </div>
                <div className={c('email')}>
                    { user.email }
                </div>
            </div>
            <div className={c('buttons')}>
                <Button href={user.url}>Author Page</Button>
                <Button href={user.editUrl}>Edit in Admin</Button>
            </div>
        </div>
    )
}
