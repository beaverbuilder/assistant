import React, { Fragment, useState } from 'react'
import { ScreenHeader } from 'components/panel-parts'
import { PostList } from 'components/post-list'
import { TagGroup, Tag } from 'components'

export const FindTab = props => {
    const [ currentTab, setCurrentTab ] = useState( 'page' )
    const { types } = FLAssistantInitialData.site
    const tabs = []

    Object.keys( types ).map( ( key ) => tabs.push( {
        label: types[ key ],
        onClick: () => setCurrentTab( key ),
        isSelected: key === currentTab,
    } ) )

	tabs.push( {
	   label: 'Favorites',
	   onClick: () => setCurrentTab( 'favorites' ),
	   isSelected: 'favorites' === currentTab,
   } )

    return (
        <Fragment>
            <ScreenHeader>
                <TagGroup appearance="vibrant">
                    <Tag count="3">Posts</Tag>
                    <Tag count="54">Pages</Tag>
                    <Tag count="29">Products</Tag>
                    <Tag count="149">Media</Tag>
                    <Tag count="13">Authors</Tag>
                    <Tag count="9">Categories</Tag>
                    <Tag count="23">Tags</Tag>
                </TagGroup>
                <TagGroup title="Something Else" appearance="muted">
                    <Tag>Today</Tag>
                    <Tag>This Week</Tag>
                    <Tag>This Month</Tag>
                    <Tag>2019</Tag>
                </TagGroup>
                <TagGroup title="Last Edited">
                    <Tag>Today</Tag>
                    <Tag>This Week</Tag>
                    <Tag>This Month</Tag>
                    <Tag>2019</Tag>
                </TagGroup>
            </ScreenHeader>
            <PostList type={ currentTab } />
        </Fragment>
    )
}
