import React, { useContext } from 'fl-react'
import classname from 'classnames'
import InfiniteScroll from 'react-infinite-scroller'
import { Page, Nav } from 'lib'
import './style.scss'

import { isRenderProp } from 'shared-utils/react'
import { isColor } from 'shared-utils/color'
import { isURL } from 'shared-utils/url'

import {
	getDefaultItemProps,
	getListWrapperType,
	getItemType,
} from './parts'

export const List = ( {
	children, // Literal Children | Item contents render function

	items, // [{Object}] | null

	listType = 'unordered', // ordered | unordered | definition

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

	// Component to use for outermost wrapper
	getWrapperComponent = () => getListWrapperType( listType ),

	...rest, // Anything else will get folded into Wrapper props
} ) => {

	const { scrollRef } = useContext( Page.Context )
	const renderListItems = items => {

		return items.map( ( item, i ) => {

			if ( isListSection( item ) ) {

				const Section = getItemComponent( item, true )
				const sectionProps = getItemProps( item, i )
				const sectionItems = getSectionItems( item )
				return (
					<Section {...sectionProps}>
						<List items={sectionItems} />
					</Section>
				)
			} else {
				return renderItem( item, i )
			}
		} )
	}

	const renderItem = ( item, i ) => {
		const Item = getItemComponent( item )

		const props = getItemProps( item, i )
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

	const Wrap = getWrapperComponent()
	return (
		<InfiniteScroll
			pageStart={0}
			loadMore={ () => console.log( 'load more' ) }
			hasMore={false}
			useWindow={false}
			getScrollParent={ () => scrollRef.current }
		>
			<Wrap className="fl-asst-list" {...rest}>{content}</Wrap>
		</InfiniteScroll>
	)
}

const InfoItem = ( {
	label,
	description,
	thumbnail,
	className,
	...rest
} ) => {
	const classes = classname( {
		'fl-asst-list-item-content-info': true,
	}, className )

	let hasThumbnail = false
	let color = false
	if ( thumbnail && isURL( thumbnail ) ) {
		hasThumbnail = true
	} else if ( label && isColor( label ) ) {
		hasThumbnail = true
		color = label
	}

	return (
		<div className={classes} {...rest}>
			{ hasThumbnail &&
				<div className="fl-asst-list-item-thumbnail">
					{ thumbnail && <img src={thumbnail} /> }
					{ color && <div className="fl-asst-list-item-color-thumbnail"  style={{ backgroundColor: color }} /> }
				</div>
			}
			<div className="fl-asst-list-item-subject">
				{ label && <div className="fl-asst-list-item-title">{label}</div> }
				{ description && <div className="fl-asst-list-item-description">{description}</div> }
			</div>
		</div>
	)
}

List.Item = ( {
	children,
	className,
	tag: Tag = 'li',
	...rest
} ) => {
	const classes = classname( 'fl-asst-list-item', className )
	const props = {
		className: classes,
		tabIndex: -1,
	}
	return (
		<Tag {...props}>{ children ? children : <InfoItem {...rest} /> }</Tag>
	)
}
List.Item.displayName = 'List.Item'

List.Section = ( { children, className, label, ...rest } ) => {
	const classes = classname( 'fl-asst-list-section', className )
	return (
		<li className={classes} {...rest}>
			<div className="fl-asst-list-section-header">{label}</div>
			<div className="fl-asst-list-section-content">{children}</div>
		</li>
	)
}
List.Section.displayName = 'List.Section'


List.TestSheet = () => {
	const { path } = useContext ( Nav.Context )

	const padSides = { padding: '0 var(--fl-asst-outer-space)'}

	const SimpleDataExample = () => {
		const items = [ 'Red', 'Green', 'Blue', 'Orange', 'Yellow', 'rebeccapurple', 'rgba(0,0,0,.4)' ]
		return (
			<>
				<h2 style={padSides}>Simple Data Example</h2>
				<List items={items} />
			</>
		)
	}

	const DataDrivenExample = () => {
		const items = [
			{
				label: 'Post One',
				caption: 'This is something you really want to see.'
			},
			{
				label: 'Post Two- This one has a really long title so we\'ll need to deal with that somehow',
				caption: 'This is something you really want to see.',
				thumb: 'https://images.unsplash.com/photo-1560932668-46f7a662129e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
			},
			{
				label: 'Post Three',
				caption: 'This is something you really want to see.',
				img: 'https://images.unsplash.com/photo-1560866564-d9b7dcecb5fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
			},
			{
				label: 'Post Four',
				description: 'Hey this is a description!',
			},
			{
				label: 'Post Five'
			},
		]
		return (
			<>
				<h2 style={padSides}>Array-Driven List</h2>
				<List items={items} />
			</>
		)
	}

	const SectionedListExample = () => {
		const items = [
			{
				label: 'Section One',
				type: 'list-section',
				items: [
					{ title: 'Sectioned Post One' },
					{ title: 'Sectioned Post Two' },
					{ title: 'Sectioned Post Three' },
					{ title: 'Sectioned Post Four' },
					{ title: 'Sectioned Post Five' },
				],
			},
			{
				label: 'Section Two',
				type: 'list-section',
				items: [],
			},
		]
		return (
			<>
				<h2 style={padSides}>Sectioned List</h2>
				<List items={items} />
			</>
		)
	}

	const HeterogeneousExample = () => {
		const items = [
			{
				type: 'page',

			}
		]
		return (
			<>
				<h2 style={padSides}>Heterogeneous Types Example</h2>
				<List items={items} />
			</>
		)
	}

	const PostListExample = () => {
		return (
			<Page>
				Post List Examples.
			</Page>
		)
	}

	return (
		<>
			<h1 style={padSides}>List Examples</h1>
			<SimpleDataExample />
			<DataDrivenExample />
			<SectionedListExample />

			<Nav.Switch>
				<Nav.Route path={`${path}/posts`} component={PostListExample} />
			</Nav.Switch>
			<Nav.Link to={`${path}/posts`}>Posts</Nav.Link>
		</>
	)
}
List.TestSheet.displayName = 'List.TestSheet'
