import React, { Fragment } from 'react'
import { Separator, Widget } from 'components'
import { ScreenHeader } from 'components/panel-parts'
import { CurrentlyViewing } from './currently-viewing'
import { RecentlyEditedWidget } from './recently-edited'

export const DashboardTab = props => {
    const { name } = FLAssistantInitialData.user
    const recentQuery = {

    }
    return (
        <Fragment>
            <ScreenHeader title={`Welcome, ${name}`}>
                <CurrentlyViewing />
            </ScreenHeader>

            <RecentlyEditedWidget />
            <Separator />

            <Widget title="Collaborators">
                Content Here.
            </Widget>
		</Fragment>
    )
}
