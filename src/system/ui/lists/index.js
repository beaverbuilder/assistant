import React from 'react'
import classname from 'classnames'
import { Item, Loading, NoResultsMessage, EndMessage, InlineCreate } from './parts'
import { useListItems } from './items'
import { Scroller, useScrollLoader } from './scroller'
import { WordPress } from './wordpress'
import { Comments } from './comments'
import { Posts } from './posts'
import { Users } from './users'
import { Updates } from './updates'
import Attachments from './attachments'
import Sortable from './sortable'
// import Code from './code'
import './style.scss'

import { isRenderProp } from 'utils/react'

import {
	getDefaultItemProps,
	getItemType,
	getDefaultSectionProps,
} from './parts'

const List = ( {
	children,

	items, // [Any] | null

	direction = 'vertical',

	defaultItemProps = { thumbnailSize: 'med' },

	getItemProps = getDefaultItemProps,

	getItemComponent = getItemType,

	// Test if a data item is a section
	isListSection = item => 'undefined' !== typeof item.items,

	// Get the array of items from a section item
	getSectionItems = section => section.items,

	getSectionProps = getDefaultSectionProps,

	tag: Tag = 'ul',

	className,

	...rest
} ) => {

	const renderListItems = items => {
		return items.map( ( item, i ) => {
			if ( isListSection( item ) ) {
				const Section = getItemComponent( item, true, getItemType( item, true ) )
				const defaultProps = { key: i, label: 'undefined' === typeof item.label ? '' : item.label }
				const sectionProps = getSectionProps( item, defaultProps )
				const sectionItems = getSectionItems( item )
				const subListProps = {
					direction,
					defaultItemProps,
					getItemProps,
					getItemComponent,
					isListSection: () => false,
					getSectionItems,
					tag: Tag,
				}
				if ( ! sectionItems.length ) {
					return null
				}
				return (
					<Section { ...sectionProps }>
						{ sectionItems && <List items={ sectionItems } { ...subListProps }  /> }
					</Section>
				)
			} else {
				return renderItem( item, i )
			}
		} )
	}

	const renderItem = ( item, i ) => {
		const Item = getItemComponent( item, false, getItemType( item, false ) )
		const defaultProps = { ...defaultItemProps, key: i }
		const props = getItemProps( item, defaultProps )

		if ( isRenderProp( children ) ) {
			return (
				<Item { ...props }>{ children( item ) }</Item>
			)
		} else {
			return <Item { ...props } />
		}
	}

	let content = children

	// Is this a data-driven list?
	if ( Array.isArray( items ) && items.length ) {
		content = renderListItems( items )
	}

	const classes = classname( {
		'fl-asst-list': true,
		[`fl-asst-${direction}-list`]: direction,
	}, className )

	return (
		<Tag className={ classes } { ...rest }>{content}</Tag>
	)
}

List.Item = Item
List.Scroller = Scroller
List.WordPress = WordPress
List.Comments = Comments
List.Posts = Posts
List.Users = Users
List.Updates = Updates
List.Attachments = Attachments
List.Loading = Loading
List.NoResultsMessage = NoResultsMessage
List.EndMessage = EndMessage
List.useScrollLoader = useScrollLoader
List.useListItems = useListItems
List.InlineCreate = InlineCreate
List.Sortable = Sortable
// List.Code = Code

export { List }

export default List
