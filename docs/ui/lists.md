# Assistant Lists Documentation

- [Introduction](#introduction)
- [List Components](#list-components)
	- [List](#list)
	- [List.Scroller](#listscroller)
	- [List.WordPress](#listwordpress)

## Introduction
Lists are a big part of Assistant and can be found in many of the core apps. You can find a number of components for working with lists under system/ui/lists.

## List Components

### List
The `<List>` component is the most basic component for creating lists in Assistant. It can either be passed child components such as `<List.Item>` or an array of item data using the `items` prop.

When using the `items` prop, it is often useful to also use the `getItemProps` callback to adjust the props for each item. In the example below, we are using that callback to add a route for each item using the `to` prop. Additional item props include `label`, `description`, and `thumbnail`.

Finally, items using the `items` prop may also define an `accessory` and/or `extras` prop for injecting components into different parts of the item. Accessories are typically a button that shows to the right of the item's info. Extras are typically links or actions that show up below the item's info when it is hovered. Examples are included below.

```
import { List } from 'ui'

const MyList = () => {
	const items = [
		{ id: 1, label: 'Item 1', description: 'This is item 1.' },
		{ id: 2, label: 'Item 2', description: 'This is item 2.' },
	]
	return (
		<List
			tag='ul' // Defaults to ul
			className='example'
			items={ items }
			getItemProps={ ( item, defaultProps ) => {
				return {
					...defaultProps,
					accessory: props => <ExampleAccessory { ...props } />,
					extras: props => <ExampleExtras { ...props } />,
					to: {
						pathname: `/example/detail/${item.id}`,
						state: { item },
					},
				}
			} }
		/>
	)
}
```

### List.Scroller
The `<List.Scroller>` component allows you to create lists that support infinite scrolling. It returns a `<List>` component and can accept all of the same props.

This component requires saving item data in state which can then be appended when new items are loaded in the `loadItems` callback. When no more items are available, set the `hasMoreItems` prop to `false` to prevent any further loading.

```
import React, { useState } from 'react'
import { List } from 'ui'

const MyScrollerList = () => {
	const { items, setItems } = useState( [] )
	const { hasMoreItems, setHasMoreItems } = useState( true )
	const loadItems = ( loadingComplete ) => {
		getExampleContent().then( response => {
			setItems( items.concat( response.items ) )
			setHasMoreItems( response.hasMore )
			loadingComplete()
		} )
	}
	return (
		<List.Scroller
			items={ items }
			hasMoreItems={ hasMoreItems }
			loadItems={ loadItems }
		/>
	)
}
```

### List.WordPress
The `<List.WordPress>` component allows you to create lists using built-in WordPress data types. It returns a `<List.Scroller>` component and can accept all of the same props.

Current data types for this component are `posts`, `terms`, `comments`, `attachments`, `users`, and `updates`. You typically won't have to work directly with this component as we have components setup for each data type such as `<List.Posts>`. See the system/ui/lists folder for a complete list of the components available.

```
import { List } from 'ui'

const MyWordPressList = () => {
	return (
		<List.WordPress
			type='posts'
		/>
	)
}
```
