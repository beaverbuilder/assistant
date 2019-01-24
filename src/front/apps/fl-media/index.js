import React, { Fragment } from 'react'
import { Tag, TagGroup, ScreenHeader, EmptyMessage, ContentList } from 'components'

export const MediaTab = props => {
    const query = {
        'posts_per_page' : 100,
        'post_type' : 'attachment'
    }
    return (
        <Fragment>
            <ScreenHeader>
                <TagGroup appearance="vibrant">
                    <Tag>Images</Tag>
                    <Tag>Videos</Tag>
                    <Tag>Documents</Tag>
                </TagGroup>
            </ScreenHeader>
            <ContentList query={query} item={<Item />} />
        </Fragment>
    )
}

const Item = ({ title }) => {
    return (
        <div>{title}</div>
    )
}
