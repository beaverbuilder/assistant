import React, { Fragment, useState } from 'react'
import { ContentList } from 'components'
import { TagGroup, Tag, TagGroupControl, ScreenHeader, ExpandedContents } from 'components'

export const FindTab = props => {
    const [type, setType] = useState('posts')
    const [subType, setSubType] = useState('page')
    const [date, setDate] = useState('today')

    const typeTags = [
        {
            label: 'Posts',
            value: ['posts', 'post'],
        },
        {
            label: 'Pages',
            value: ['posts', 'page'],
        },
        {
            label: 'Media',
            value: ['posts', 'attachment'],
        },
        {
            label: 'Categories',
            value: ['terms', 'category'],
        },
        {
            label: 'Tags',
            value: ['terms', 'post_tag'],
        },
    ]
    const changeType = value => {
        if ( Array.isArray(value) ) {
            const [type, subType] = value
            setType(type)
            setSubType(subType)
        } else {
            setType(value)
        }
    }

    const dateTags = [
        {
            label: 'Today',
            value: 'today',
        },
        {
            label: 'This Week',
            value: 'week',
        },
        {
            label: 'This Month',
            value: 'month',
        },
        {
            label: '2019',
            value: 'year'
        }
    ]
    const changeDate = value => setDate(value)

    let query = {
        post_type: subType,
        numberposts: -1,
        orderby: 'title',
        order: 'ASC',
        s: '',
    }
    let typeTagValue = [type, subType]
    if ( 'terms' === type ) {
        query = {
            taxonomy: subType,
            'hide_empty': false
        }
        typeTagValue = [type, subType]
    }

    console.log(query, typeTagValue )

    return (
        <Fragment>
            <ScreenHeader>
                <TagGroupControl tags={typeTags} value={typeTagValue} onChange={changeType} appearance="vibrant" />
                <ExpandedContents>
                    <TagGroupControl tags={dateTags} value={date} title="Last Edited" onChange={changeDate} />
                </ExpandedContents>
            </ScreenHeader>

			<ContentList
				type={type}
				query={query}
                itemConfig={{
                    showThumb: true,
            		showMeta: true,
            		showActions: true,
                }}
			/>
        </Fragment>
    )
}
