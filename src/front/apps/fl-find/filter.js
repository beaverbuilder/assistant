import React, { Fragment } from 'react'
import { __ } from '@wordpress/i18n'
import { useAppState, getAppActions, getSystemConfig, useSystemState } from 'store'
import { TagGroupControl, ExpandedContents } from 'components'

export const PostListFilter = () => {
	const { filter } = useAppState()
	const { setType, setDate, setStatus } = getAppActions()
	const { typeTags, dateTags, statusTags } = getFilterTags()
	const { type, subType, date, status } = filter

	return (
		<Fragment>
			<TagGroupControl limit={ 6 } tags={typeTags} value={[ type, subType ]} onChange={setType} appearance="muted" />
			{ 'posts' === type &&
				<ExpandedContents>
					<TagGroupControl tags={dateTags} value={date} title={__('Created')} onChange={setDate} />
					{ 'attachment' !== subType &&
						<TagGroupControl tags={statusTags} value={status} title={__('Status')} onChange={setStatus} />
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
			label: __('Any'),
			value: '',
		},
		{
			label: __('Today'),
			value: 'today',
		},
		{
			label: __('This Week'),
			value: 'week',
		},
		{
			label: __('This Month'),
			value: 'month',
		},
		{
			label: now.getFullYear(),
			value: 'year'
		}
	]

	const statusTags = [
		{
			label: __('Any'),
			value: 'any',
		},
		{
			label: __('Published'),
			value: 'publish',
		},
		{
			label: __('Draft'),
			value: 'draft',
		},
		{
			label: __('Pending'),
			value: 'pending',
		},
		{
			label: __('Scheduled'),
			value: 'future',
		},
		{
			label: __('Private'),
			value: 'private',
		},
		{
			label: __('Trash'),
			value: 'trash',
		},
	]

	return {
		typeTags,
		dateTags,
		statusTags,
	}
}
