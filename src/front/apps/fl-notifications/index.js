import React, { Fragment } from 'react'
import { Tag, TagGroup, ScreenHeader, EmptyMessage } from 'components'

export const NotificationsTab = props => {
    return (
        <Fragment>
            <ScreenHeader>
                <TagGroup appearance="muted">
                    <Tag count="0">All</Tag>
                    <Tag count="0">Comments</Tag>
                    <Tag count="0">Notices</Tag>
                </TagGroup>
            </ScreenHeader>

            <EmptyMessage>No Notifications</EmptyMessage>
        </Fragment>
    )
}
