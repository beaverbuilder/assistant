import React, { Fragment, useEffect } from 'react'
import { TagGroupControl, ExpandedContents } from 'components'
import { useAppState, useConfig, useStore } from 'store'
import { getWeek } from 'utils/datetime'

export const PostListFilter = ( { onChange } ) => {
	const [ type, setType ] = useAppState( 'post-filter-type', 'posts' )
	const [ subType, setSubType ] = useAppState( 'post-filter-sub-type', 'page' )
	const [ date, setDate ] = useAppState( 'post-filter-date-type', '' )
	const [ status, setStatus ] = useAppState( 'post-filter-status-type', 'publish' )
	const { counts } = useStore()
	const { contentTypes, taxonomies } = useConfig()
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

	const changeType = value => {
		if ( Array.isArray( value ) ) {
			const [ type, subType ] = value
			setType( type )
			setSubType( subType )
		} else {
			setType( value )
		}
	}

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

	// Setup the query
	let query = {}
	let typeTagValue = [ type, subType ] // Value to pass to the 'type' tag group

	switch ( type ) {

	// Handle post queries
	case 'posts':
		query = {
			post_type: subType,
			posts_per_page: 20,
			orderby: 'title',
			order: 'ASC',
			s: '',
			post_status: 'attachment' === subType ? 'any' : status,
		}
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

	// Handle taxonomy queries
	case 'terms':
		query = {
			taxonomy: subType,
			hide_empty: 0
		}
		typeTagValue = [ type, subType ]
		break
	}

	useEffect( () => {
		onChange( { type, query } )
	}, [ type, JSON.stringify( query ) ] )

	return (
		<Fragment>
			<TagGroupControl tags={typeTags} value={typeTagValue} onChange={changeType} appearance="vibrant" />
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
