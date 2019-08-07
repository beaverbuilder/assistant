import React from 'fl-react'
import classname from 'classnames'
import { TestSheet } from './examples'
import { Item, Loading } from './parts'
import { Scroller, useScrollLoader } from './scroller'
import { WordPress } from './wordpress'
import { Comments } from './comments'
import { Posts } from './posts'
import { Updates } from './updates'
import './style.scss'

import { isRenderProp } from 'shared-utils/react'

import {
	defaultItemProps,
	getDefaultItemProps,
	getItemType,
} from './parts'

export const List = ( {
	children,

	items, // [Any] | null

	direction = 'vertical',

	defaultItemProps = defaultItemProps,

	getItemProps = getDefaultItemProps,

	getItemComponent = getItemType,

	// What key do we use to determine if an item is a section?
	itemTypeKey = 'type',

	// What key should we use (by default) to get section items?
	sectionItemsKey = 'items',

	// Test if a data item is a section
	isListSection = item => ( 'undefined' !== typeof item[itemTypeKey] && 'list-section' === item[itemTypeKey] ),

	// Get the array of items from a section item
	getSectionItems = section => 'undefined' !== typeof section[sectionItemsKey] ? section[sectionItemsKey] : [],

	tag: Tag = 'ul',
} ) => {

	const renderListItems = items => {
		return items.map( ( item, i ) => {

			if ( isListSection( item ) ) {
				const isSection = true
				const defaultProps = { ...defaultItemProps, key: i }

				const Section = getItemComponent( item, true )
				const sectionProps = getItemProps( item, defaultProps, isSection )
				const sectionItems = getSectionItems( item )
				const subListProps = {
					direction,
					defaultItemProps,
					getItemProps,
					getItemComponent,
					itemTypeKey,
					sectionItemsKey,
					isListSection: () => false,
					getSectionItems,
					tag: Tag,
				}
				return (
					<Section {...sectionProps}>
						{ sectionItems && <List items={sectionItems} {...subListProps}  /> }
					</Section>
				)
			} else {
				return renderItem( item, i )
			}
		} )
	}

	const renderItem = ( item, i ) => {
		const isSection = false
		const Item = getItemComponent( item )
		const defaultProps = { ...defaultItemProps, key: i }
		const props = getItemProps( item, defaultProps, isSection )

		if ( isRenderProp( children ) ) {
			return (
				<Item {...props}>{ children( item ) }</Item>
			)
		} else {
			return <Item {...props} />
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
	} )

	return (
		<Tag className={classes}>{content}</Tag>
	)
}

List.Item = Item
List.Item.displayName = 'List.Item'

List.Loading = Loading
List.Loading.displayName = 'List.Loading'

List.Scroller = Scroller
List.Scroller.displayName = 'List.Scroller'
List.useScrollLoader = useScrollLoader

List.WordPress = WordPress
List.WordPress.displayName = 'List.WordPress'

List.Comments = Comments
List.Comments.displayName = 'List.Comments'

List.Posts = Posts
List.Posts.displayName = 'List.Posts'

List.Updates = Updates
List.Updates.displayName = 'List.Updates'

List.TestSheet = TestSheet
List.TestSheet.displayName = 'List.TestSheet'
