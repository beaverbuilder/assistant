import React, { Fragment, useEffect } from 'react'
import { TagGroupControl, ExpandedContents } from 'components'
import { useAppState, getConfig, useStore } from 'store'
import { getWeek } from 'utils/datetime'

export const PostListFilter = ( { onChange } ) => {
	const [ filter, setFilter ] = useAppState( 'filter' )
	const { type, subType, date, status } = filter
	const { counts } = useStore()
	const { contentTypes, taxonomies } = getConfig()
	const now = new Date()
	const typeTags = []

	Object.keys( contentTypes ).map( type => {
		typeTags.push( {
			label: contentTypes[ type ],
			value: [ 'posts', type ],
			count: counts[ `content/${ type }` ] || '0'
		} )
	} )

	Object.keys( taxonomies ).map( type => {
		typeTags.push( {
			label: taxonomies[ type ],
			value: [ 'terms', type ],
			count: counts[ `taxonomy/${ type }` ] || '0'
		} )
	} )

	const dateTags = [
		{
			label: 'Any',
			value: '',
		},
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
			label: now.getFullYear(),
			value: 'year'
		}
	]

	const statusTags = [
		{
			label: 'Any',
			value: 'any',
		},
		{
			label: 'Published',
			value: 'publish',
		},
		{
			label: 'Draft',
			value: 'draft',
		},
		{
			label: 'Pending',
			value: 'pending',
		},
		{
			label: 'Scheduled',
			value: 'future',
		},
		{
			label: 'Private',
			value: 'private',
		},
		{
			label: 'Trash',
			value: 'trash',
		},
	]

	const onTypeChange = value => {
		const [ type, subType ] = value
		setFilter( { ...filter, type, subType } )
	}

	const onDateChange = date => {
		setFilter( { ...filter, date } )
	}

	const onStatusChange = status => {
		setFilter( { ...filter, status } )
	}

	return (
		<Fragment>
			<TagGroupControl tags={typeTags} value={[ type, subType ]} onChange={onTypeChange} appearance="vibrant" />
			{ 'posts' === type &&
				<ExpandedContents>
					<TagGroupControl tags={dateTags} value={date} title="Created" onChange={onDateChange} />
					{ 'attachment' !== subType &&
						<TagGroupControl tags={statusTags} value={status} title="Status" onChange={onStatusChange} />
					}
				</ExpandedContents>
			}
		</Fragment>
	)
}
