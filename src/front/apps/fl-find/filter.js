import React, { Fragment, useEffect } from 'react'
import { useAppState, getConfig, useStore } from 'store'
import { TagGroupControl, ExpandedContents } from 'components'
import { getWeek } from 'utils/datetime'

export const PostListFilter = () => {
	const {
		typeTags,
		dateTags,
		statusTags,
		setType,
		setDate,
		setStatus,
		type,
		subType,
		date,
		status
	} = getFilterData()

	return (
		<Fragment>
			<TagGroupControl tags={typeTags} value={[ type, subType ]} onChange={setType} appearance="vibrant" />
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

export const getFilterData = () => {
	const [ query, setQuery ] = useAppState( 'query' ) // eslint-disable-line no-unused-vars
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

	const setType = value => {
		const [ type, subType ] = value
		setFilter( { ...filter, type, subType } )
	}

	const setDate = date => {
		setFilter( { ...filter, date } )
	}

	const setStatus = status => {
		setFilter( { ...filter, status } )
	}

	useEffect( () => {
		const query = {}
		switch ( type ) {
		case 'posts':
			query.post_type = subType
			query.posts_per_page = 20
			query.orderby = 'title'
			query.order = 'ASC'
			query.s = ''
			query.post_status = 'attachment' === subType ? 'any' : status
			switch ( date ) {
			case 'today':
				query.year = now.getFullYear()
				query.month = now.getMonth() + 1
				query.day = now.getDate()
				break
			case 'week':
				query.year = now.getFullYear()
				query.w = getWeek( now )
				break
			case 'month':
				query.year = now.getFullYear()
				query.month = now.getMonth() + 1
				break
			case 'year':
				query.year = now.getFullYear()
				break
			}
			break
		case 'terms':
			query.taxonomy = subType
			query.hide_empty = 0
			break
		}

		setQuery( query )
	}, [ type, subType, date, status ] )

	return {
		typeTags,
		dateTags,
		statusTags,
		setType,
		setDate,
		setStatus,
		type,
		subType,
		date,
		status
	}
}
