import React, { Fragment } from 'react'
import { Tag, TagGroup, ScreenHeader } from 'components'

export const MediaTab = props => {
    return (
        <Fragment>
            <ScreenHeader>
                <TagGroup appearance="vibrant">
                    <Tag>All</Tag>
                    <Tag>Images</Tag>
                    <Tag>Videos</Tag>
                    <Tag>Documents</Tag>
                </TagGroup>
            </ScreenHeader>
            Media.
        </Fragment>
    )
}
