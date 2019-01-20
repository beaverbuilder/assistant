import React, { Fragment } from 'react'
import { ScreenHeader } from 'components/panel-parts'

export const NotificationsTab = props => {
    return (
        <Fragment>
            <ScreenHeader>
                <div className="fl-asst-screen-title">Notifications</div>
            </ScreenHeader>
            
            <div>Get your notifications here.</div>
        </Fragment>
    )
}
