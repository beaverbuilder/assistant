import React, { Fragment } from 'react'
import { Tag, TagGroup, ScreenHeader, EmptyMessage } from 'components'

export const MediaTab = props => {
    return (
        <Fragment>
            <ScreenHeader>
                <TagGroup appearance="vibrant">
                    <Tag>Images</Tag>
                    <Tag>Videos</Tag>
                    <Tag>Documents</Tag>
                </TagGroup>
            </ScreenHeader>
            <EmptyMessage>Come Back Later.</EmptyMessage>
        </Fragment>
    )
}
