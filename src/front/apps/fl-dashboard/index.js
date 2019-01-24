import React, { Fragment } from 'react'
import { CurrentlyViewing } from './currently-viewing'
import { Separator, Widget, Tag, TagGroup } from 'components'
import { ScreenHeader } from 'components/panel-parts'

export const DashboardTab = props => {
    const { name } = FLAssistantInitialData.user
    const dummiePost = {
        title: 'Test Test',
        author: 'Brent',
        date: 'That Super Cold Day'
    }
    return (
        <Fragment>
            <ScreenHeader title={`Welcome, ${name}`}>
                <CurrentlyViewing />
            </ScreenHeader>

            <Widget title="Recently Edited" isPadded={false}>
                <div style={{ padding: '0 20px'}}>
                    <TagGroup appearance="vibrant">
                        <Tag count="3">Posts</Tag>
                        <Tag count="4">Pages</Tag>
                    </TagGroup>
                </div>
            </Widget>
            <Separator />

            <Widget title="Collaborators">
                Content Here.
            </Widget>
            <Separator />

            <Widget title="You Tell Me">
                Something Great Here!
            </Widget>
		</Fragment>
    )
}
