import React, { Fragment } from 'react'
import { Tag, TagGroup, ScreenHeader, EmptyMessage, ExpandedContents, ContentList } from 'components'

export const NotificationsTab = props => {
    return (
        <Fragment>
            <ScreenHeader>
                <TagGroup appearance="muted">
                    <Tag count="0">All</Tag>
                    <Tag count="0">Comments</Tag>
                </TagGroup>

                <ExpandedContents>
                    <TagGroup title="Created">
                        <Tag>Today</Tag>
                        <Tag>This Week</Tag>
                        <Tag>This Month</Tag>
                        <Tag>2019</Tag>
                    </TagGroup>
                </ExpandedContents>
            </ScreenHeader>

            <ContentList type="comments" />
        </Fragment>
    )
}
