import React, { Fragment, useState } from 'react'
import { PostList } from 'components/post-list'
import { TagGroup, Tag, TagGroupControl, ScreenHeader, ExpandedContents } from 'components'

export const FindTab = props => {
    const defaultQuery = {
        post_type: 'page',
        numberposts: -1,
        orderby: 'title',
        order: 'ASC',
        /*s: '',*/
    }
    const [query, setQuery] = useState(defaultQuery)

    const typeTags = [
        {
            label : 'Posts',
            value: { type: 'post', postType: 'post' }
        },
        {
            label : 'Pages',
            value: { type: 'post', postType: 'page' },
            count: 27,
        },
        /*
        {
            label : 'Authors',
            value: 'user'
        },
        {
            label : 'Categories',
            value: 'cat'
        },
        {
            label : 'Tags',
            value: 'tag'
        },
        */
    ]
    const changeType = value => {
        console.log(value)
        const query = {
            'post_type': value.postType
        }
        setQuery( Object.assign({}, defaultQuery, query ))
    }

    return (
        <Fragment>
            <ScreenHeader>

                <TagGroupControl tags={typeTags} appearance="vibrant" onChange={changeType} />

                { false &&<ExpandedContents>
                    <TagGroup title="Last Edited">
                        <Tag>Today</Tag>
                        <Tag>This Week</Tag>
                        <Tag>This Month</Tag>
                        <Tag>2019</Tag>
                    </TagGroup>
                </ExpandedContents> }

            </ScreenHeader>

			<PostList query={query} />
        </Fragment>
    )
}
