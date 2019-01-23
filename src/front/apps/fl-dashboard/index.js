import React, { Fragment } from 'react'
import { CurrentlyViewing } from './currently-viewing'
import { Separator, Widget, Tag, TagGroup } from 'components'
import { ScreenHeader } from 'components/panel-parts'

export const DashboardTab = props => {
    const { name } = FLAssistantInitialData.user
    return (
        <Fragment>
            <ScreenHeader title={`Welcome, ${name}`}>
                <CurrentlyViewing />
            </ScreenHeader>

            <Widget title="Recently Edited">
                <TagGroup appearance="vibrant">
                    <Tag count="3">Posts</Tag>
                    <Tag count="4">Pages</Tag>
                </TagGroup>
            </Widget>
            <Separator />

            <Widget title="Collaborators">
                Content Here.
            </Widget>
		</Fragment>
    )
}
