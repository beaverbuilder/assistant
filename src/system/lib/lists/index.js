import React from 'fl-react'
import classname from 'classnames'
import { TestSheet } from './examples'
import { Item, Loading } from './parts'
import { useListItems } from './items'
import { Scroller, useScrollLoader } from './scroller'
import { WordPress } from './wordpress'
import { Comments } from './comments'
import { Posts } from './posts'
import { Users } from './users'
import { Updates } from './updates'
import './style.scss'

import { isRenderProp } from 'shared-utils/react'

import {
	defaultItemProps, // eslint-disable-line no-unused-vars
	getDefaultItemProps,
	getItemType,
	getDefaultSectionProps,
} from './parts'

export const List = ( {
	children,

	items, // [Any] | null

	direction = 'vertical',

	defaultItemProps = defaultItemProps,

	getItemProps = getDefaultItemProps,

	getItemComponent = getItemType,

	// Test if a data item is a section
	isListSection = item => 'undefined' !== typeof item.items,

	// Get the array of items from a section item
	getSectionItems = section => section.items,

	getSectionProps = getDefaultSectionProps,

	isSelecting = false,

	tag: Tag = 'ul',

	className,
} ) => {

	const renderListItems = items => {
		return items.map( ( item, i ) => {
			if ( isListSection( item ) ) {
				const Section = getItemComponent( item, true )
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
		const Item = getItemComponent( item )
		const defaultProps = { ...defaultItemProps, key: i, isSelecting }
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
		'fl-asst-list-is-selecting': isSelecting,
	}, className )

	return (
		<Tag className={ classes }>{content}</Tag>
	)
}

List.Item = Item
List.Item.displayName = 'List.Item'

List.Loading = Loading
List.Loading.displayName = 'List.Loading'

List.Scroller = Scroller
List.Scroller.displayName = 'List.Scroller'

List.WordPress = WordPress
List.WordPress.displayName = 'List.WordPress'

List.Comments = Comments
List.Comments.displayName = 'List.Comments'

List.Posts = Posts
List.Posts.displayName = 'List.Posts'

List.Users = Users
List.Users.displayName = 'List.Users'

List.Updates = Updates
List.Updates.displayName = 'List.Updates'

List.TestSheet = TestSheet
List.TestSheet.displayName = 'List.TestSheet'

List.useScrollLoader = useScrollLoader
List.useListItems = useListItems
