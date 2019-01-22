import React, { Fragment } from 'react'
import { Tag, TagGroup, ScreenHeader } from 'components'

export const NotificationsTab = props => {
    return (
        <Fragment>
            <ScreenHeader>
                <TagGroup appearance="muted">
                    <Tag>Today</Tag>
                    <Tag>This Week</Tag>
                    <Tag>This Month</Tag>
                    <Tag>2019</Tag>
                </TagGroup>
            </ScreenHeader>

            <div>Get your notifications here.</div>
        </Fragment>
    )
}
