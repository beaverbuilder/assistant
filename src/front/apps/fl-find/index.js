import React, { Fragment, useState } from 'react'
import { PostList } from 'components/post-list'
import { TagGroup, Tag, ScreenHeader, ExpandedContents } from 'components'

export const FindTab = props => {
    console.log('render find')
    const query = {
        post_type: 'page',
        numberposts: -1,
        orderby: 'title',
        order: 'ASC',
        s: '',
    }

    const toggleValue = ( key, value ) => {
        console.log('set', key, value )
    }

    return (
        <Fragment>
            <ScreenHeader>
                <TagGroup appearance="vibrant">
                    <Tag count="3">Posts</Tag>
                    <Tag count="54">Pages</Tag>
                    <Tag count="13">Authors</Tag>
                    <Tag count="9">Categories</Tag>
                    <Tag count="23">Tags</Tag>
                </TagGroup>

                <ExpandedContents>
                    <TagGroup title="Last Edited">
                        <Tag>Today</Tag>
                        <Tag>This Week</Tag>
                        <Tag>This Month</Tag>
                        <Tag>2019</Tag>
                    </TagGroup>
                </ExpandedContents>

            </ScreenHeader>

			<PostList query={query} />
        </Fragment>
    )
}
