import React from 'fl-react'
import classname from 'classnames'
import { TestSheet } from './examples'
import { Item } from './parts'
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

	// Page context provides the default scrolling element ref for scroll events
	//const { scrollRef } = useContext( Page.Context )

	const renderListItems = items => {
		return items.map( ( item, i ) => {

			if ( isListSection( item ) ) {
				const defaultProps = { ...defaultItemProps, key: i }

				const Section = getItemComponent( item, true )
				const sectionProps = getItemProps( item, defaultProps )
				const sectionItems = getSectionItems( item )
				return (
					<Section {...sectionProps}>
						{ sectionItems && <List items={sectionItems} /> }
					</Section>
				)
			} else {
				return renderItem( item, i )
			}
		} )
	}

	const renderItem = ( item, i ) => {
		const Item = getItemComponent( item )
		const defaultProps = { ...defaultItemProps, key: i }
		const props = getItemProps( item, defaultProps )

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

List.TestSheet = TestSheet
List.TestSheet.displayName = 'List.TestSheet'
