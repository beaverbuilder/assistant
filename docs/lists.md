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
The `<List>` component is the most basic list component in Assistant.

```
import { List } from 'ui'

const MyList = () => {
	return (
		<List>

		</List>
	)
}
```

### List.Scroller
```
import { List } from 'ui'

const MyScrollerList = () => {
	return (
		<List.Scroller>

		</List.Scroller>
	)
}
```

### List.WordPress
```
import { List } from 'ui'

const MyWordPressList = () => {
	return (
		<List.WordPress>

		</List.WordPress>
	)
}
```
