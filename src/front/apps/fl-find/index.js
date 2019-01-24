import React, { Fragment, useState } from 'react'
import { TagGroup, Tag, ScreenHeader, ExpandedContents, ContentList } from 'components'

export const FindTab = props => {

    // Previous tab logic
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
    })

    // NEW - Trying out a new query setup
    const query = {
        type: ['post', 'page', 'author'],
        timePeriod: 'today',
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
                    <Tag count="149" isSelected={true}>Media</Tag>
                    <Tag count="13">Authors</Tag>
                    <Tag count="9">Categories</Tag>
                    <Tag count="23">Tags</Tag>
                </TagGroup>

                <ExpandedContents>
                    <TagGroup title="Last Edited">
                        <Tag isSelected={true} onClick={() => toggleValue('timePeriod', 'today')}>Today</Tag>
                        <Tag>This Week</Tag>
                        <Tag>This Month</Tag>
                        <Tag>2019</Tag>
                    </TagGroup>
                </ExpandedContents>

            </ScreenHeader>
			<ContentList
				type="posts"
				query={ {
					post_type: 'page',
					numberposts: -1,
					orderby: 'title',
					order: 'ASC',
					s: '',
				} }
			/>
        </Fragment>
    )
}
