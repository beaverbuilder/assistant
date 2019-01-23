import React, { Fragment } from 'react'
import { CurrentlyViewing } from './currently-viewing'
import { Separator, Widget } from 'components'
import { ScreenHeader } from 'components/panel-parts'

export const DashboardTab = props => {
    const { name } = FLAssistantInitialData.user
    return (
        <Fragment>
            <ScreenHeader title={`Welcome, ${name}`}>
                <CurrentlyViewing />
            </ScreenHeader>

            <Widget title="Recently Edited">
                Content Here.
            </Widget>
            <Separator />

            <Widget title="Collaborators">
                Content Here.
            </Widget>
		</Fragment>
    )
}
