import React, { Fragment } from 'react'
import { CurrentlyViewing } from './currently-viewing'
import { Separator } from 'components'
import { ScreenHeader } from 'components/panel-parts'

export const DashboardTab = props => {
    const { name } = FLAssistantInitialData.user
    return (
        <Fragment>
            <ScreenHeader title={`Welcome, ${name}`}>
                <CurrentlyViewing />
            </ScreenHeader>

            Widgets, yo.
            <Separator />
		</Fragment>
    )
}
