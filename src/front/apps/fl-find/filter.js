import React, { Fragment } from 'react'
import { useAppState, getAppActions, getSystemConfig, useSystemState } from 'store'
import { TagGroupControl, ExpandedContents } from 'components'

export const PostListFilter = () => {
	const { filter } = useAppState()
	const { setType, setDate, setStatus } = getAppActions()
	const { typeTags, dateTags, statusTags } = getFilterTags()
	const { type, subType, date, status } = filter

	return (
		<Fragment>
			<TagGroupControl limit={ 6 } tags={typeTags} value={[ type, subType ]} onChange={setType} appearance="vibrant" />
			{ 'posts' === type &&
				<ExpandedContents>
					<TagGroupControl tags={dateTags} value={date} title="Created" onChange={setDate} />
					{ 'attachment' !== subType &&
						<TagGroupControl tags={statusTags} value={status} title="Status" onChange={setStatus} />
					}
				</ExpandedContents>
			}
		</Fragment>
	)
}

export const getFilterTags = () => {
	const { counts } = useSystemState()
	const { contentTypes, taxonomies } = getSystemConfig()
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

	return {
		typeTags,
		dateTags,
		statusTags,
	}
}
